import argparse
import getpass
import sys

from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.db.session import SessionLocal
from app.schemas.auth import BootstrapRequest
from app.services.auth_service import AuthService

RED = "\033[31m"
RESET = "\033[0m"


def print_error(message: str) -> None:
    print(f"{RED}{message}{RESET}", file=sys.stderr)


def is_missing_table_error(error: SQLAlchemyError) -> bool:
    message = str(error).lower()
    return any(
        pattern in message
        for pattern in (
            "no such table",
            "does not exist",
            "undefinedtable",
            "relation",
        )
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a superadmin user.")
    parser.add_argument("--name", help="Superadmin display name")
    parser.add_argument("--email", help="Superadmin email")
    parser.add_argument("--password", help="Superadmin password")
    parser.add_argument(
        "--no-input",
        action="store_true",
        help="Do not prompt for missing values. Requires --name, --email, and --password.",
    )
    args = parser.parse_args()

    name = args.name
    email = args.email
    password = args.password

    if args.no_input and (not name or not email or not password):
        print_error("--no-input requires --name, --email, and --password.")
        return 1

    if not name:
        name = input("Name: ").strip()
    if not email:
        email = input("Email: ").strip()
    if not password:
        password = getpass.getpass("Password: ")
        password_confirmation = getpass.getpass("Password confirmation: ")
        if password != password_confirmation:
            print_error("Passwords do not match.")
            return 1

    try:
        payload = BootstrapRequest(name=name, email=email, password=password)
    except ValidationError as error:
        print_error(str(error))
        return 1

    db = SessionLocal()
    try:
        user = AuthService(db).create_superuser(payload)
    except HTTPException as error:
        print_error(str(error.detail))
        return 1
    except SQLAlchemyError as error:
        db.rollback()
        if is_missing_table_error(error):
            print_error(
                "Database belum siap atau tabel belum dibuat. "
                "Jalankan migration terlebih dahulu: alembic upgrade head"
            )
        else:
            print_error(f"Database error: {error}")
        return 1
    finally:
        db.close()

    print(f"Superuser created: {user.email}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
