import { Icon } from "../atoms/Icon";
import type { AuthUser } from "../../types/auth";

type HeaderProps = {
  initials: string;
  isAccountMenuOpen: boolean;
  isPasswordPage: boolean;
  isProfilePage: boolean;
  onChangePassword: () => void;
  onLogout: () => void;
  onToggleAccountMenu: () => void;
  onToggleSidebar: () => void;
  onViewProfile: () => void;
  user: AuthUser;
};

export function Header({
  initials,
  isAccountMenuOpen,
  isPasswordPage,
  isProfilePage,
  onChangePassword,
  onLogout,
  onToggleAccountMenu,
  onToggleSidebar,
  onViewProfile,
  user,
}: HeaderProps) {
  return (
    <header className="dashboardHeader">
      <button
        aria-label="Toggle sidebar"
        className="iconButton sidebarToggleButton"
        onClick={onToggleSidebar}
        type="button"
      >
        <Icon className="menuIcon" name="menu" />
      </button>

      <div className="accountBar">
        <button
          aria-expanded={isAccountMenuOpen}
          aria-haspopup="menu"
          className="accountIdentity"
          onClick={onToggleAccountMenu}
          type="button"
        >
          <span className="profileAvatar">{initials}</span>
          <span className="profileName">{user.name}</span>
          <span className="accountChevron" aria-hidden="true" />
        </button>

        {isAccountMenuOpen ? (
          <div className="accountMenuPanel" role="menu">
            <div className="accountMenuHeader">
              <span className="profileAvatar large">{initials}</span>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <div className="accountMenuSection">
              <button
                className={`accountMenuItem${isProfilePage ? " active" : ""}`}
                onClick={onViewProfile}
                role="menuitem"
                type="button"
              >
                <Icon className="menuIcon" name="user" />
                <span>Profil Saya</span>
              </button>
              <button
                className={`accountMenuItem${isPasswordPage ? " active" : ""}`}
                onClick={onChangePassword}
                role="menuitem"
                type="button"
              >
                <Icon className="menuIcon" name="key" />
                <span>Ubah Password</span>
              </button>
            </div>

            <div className="accountMenuSection">
              <button className="accountMenuItem danger" onClick={onLogout} role="menuitem" type="button">
                <Icon className="menuIcon" name="logout" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
