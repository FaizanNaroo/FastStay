import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * Hook that validates the user_id from URL against session.
 * Redirects to "/" if unauthorized.
 * Returns the validated userId.
 */
const useAuthGuard = (options?: { allowGuest?: boolean }): string => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const allowGuest = options?.allowGuest ?? false;

  const urlUserId = searchParams.get("user_id");
  const storedUser = sessionStorage.getItem("authenticated_user");

  const userId = urlUserId || storedUser || "";

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    if (userId === "guest" && !allowGuest) {
      return;
    }

    if (userId !== "guest") {
      // If no stored user, or URL user_id doesn't match stored user, redirect
      if (!storedUser || (urlUserId && urlUserId !== storedUser)) {
        navigate("/");
        return;
      }
    }
  }, [userId, urlUserId, storedUser, navigate, allowGuest]);

  return userId;
};

export default useAuthGuard;
