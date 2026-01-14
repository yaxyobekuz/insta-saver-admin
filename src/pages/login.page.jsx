// Toast
import { toast } from "sonner";

// Images
import { logoImg } from "@/assets/images";

// API
import * as authAPI from "@/api/auth.api";

// Router
import { Navigate, useNavigate } from "react-router-dom";

// Components
import Card from "@/components/ui/card.component";
import Input from "@/components/form/input.component";
import Button from "@/components/form/button.component";

// Hooks
import useObjectState from "@/hooks/useObjectState.hook";

const LoginPage = () => {
  // Redirect if already logged in
  const isAuthenticated = localStorage.getItem("auth");
  if (isAuthenticated) return <Navigate to="/" replace />;

  const navigate = useNavigate();
  const { username, password, setField, isLoading } = useObjectState({
    username: "",
    password: "",
    isLoading: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setField("isLoading", true);

    try {
      const response = await authAPI.login({
        password: password.trim(),
        username: username.trim().toLowerCase(),
      });

      const { user, token } = response.data;

      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify({ user, token }));

      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Tizimga kirishda xatolik");
    } finally {
      setField("isLoading", false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white px-4">
      <div className="max-w-md w-full">
        <Card className="p-8 border-none">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              width={64}
              alt="Logo"
              height={64}
              src={logoImg}
              className="size-16 mx-auto mb-4 rounded-full"
            />
            <h2 className="text-3xl font-bold text-gray-900">Insta Saver</h2>
            <p className="text-gray-600 mt-2">Admin panelga kirish</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              required
              name="username"
              label="Username"
              value={username}
              className="[&>input]:lowercase"
              onChange={(v) => setField("username", v?.trim())}
            />

            <Input
              required
              label="Parol"
              minLength={6}
              type="password"
              name="password"
              value={password}
              onChange={(v) => setField("password", v)}
            />

            <Button disabled={isLoading} className="w-full">
              Kirish{isLoading && "..."}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
