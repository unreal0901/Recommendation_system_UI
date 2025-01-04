import { ProfileComponents } from "../application_components/Main/ProfileComponent";
import AuthGuard from "../client/Guards/AuthGuard";

export default function Profile() {
  return (
    <AuthGuard>
      <ProfileComponents />;
    </AuthGuard>
  );
}
