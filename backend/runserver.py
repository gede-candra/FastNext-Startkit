import os
import socket
import sys

import uvicorn


BOLD_RED = "\033[1;31m"
RESET = "\033[0m"


def is_port_available(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((host, port))
        except OSError:
            return False
        return True


def find_available_port(host: str, start_port: int) -> int:
    port = start_port
    while port <= 65535:
        if is_port_available(host, port):
            return port
        port += 1
    raise RuntimeError(f"No available port found from {start_port} to 65535")


def get_requested_port() -> tuple[int, bool]:
    if len(sys.argv) > 1:
        return int(sys.argv[1]), True
    if "PORT" in os.environ:
        return int(os.environ["PORT"]), True
    return 8000, False


if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    requested_port, is_explicit_port = get_requested_port()

    if is_explicit_port and not is_port_available(host, requested_port):
        url = f"http://{host}:{requested_port}"
        print(
            f"{BOLD_RED}Error: {url} is already in use.\n"
            "Another process is currently listening on this host and port, "
            "so the FastAPI server cannot start with the requested address.\n"
            "Stop the process using that port or choose a different port, "
            f"for example: python runserver.py {requested_port + 1}{RESET}"
        )
        sys.exit(1)

    port = requested_port if is_explicit_port else find_available_port(host, requested_port)

    if port != requested_port:
        print(f"Port {requested_port} is in use. Using available port {port}.")

    uvicorn.run("app.main:app", host=host, port=port, reload=True)
