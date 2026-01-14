// Toast
import { toast } from "sonner";

// Images
import { logoImg } from "@/assets/images";

// Router
import { useNavigate } from "react-router-dom";

// Hooks
import useObjectState from "@/hooks/useObjectState.hook";

// Components
import Card from "@/components/ui/card.component";
import InputComponent from "@/components/form/input.component";
import ButtonComponent from "@/components/form/button.component";

const LoginPage = () => {
  const navigate = useNavigate();

  const { username, password, setField, isLoading } = useObjectState({
    username: "",
    password: "",
    isLoading: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setField("isLoading", true);

    const data = { username, password: password?.trim() };

    authAPI
      .login(data)
      .then((response) => {
        const { user, token } = response.data.data;

        login(user, token);
        toast.success("Tizimga muvaffaqiyatli kirdingiz!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Tizimga kirishda xatolik"
        );
      })
      .finally(() => setField("isLoading", false));
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
            <p className="text-gray-600 mt-2">Tizimga kirish</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputComponent
              required
              name="username"
              label="Username"
              value={username}
              className="[&>input]:lowercase"
              onChange={(v) => setField("username", v?.trim())}
            />

            <InputComponent
              required
              label="Parol"
              minLength={6}
              type="password"
              name="password"
              value={password}
              onChange={(v) => setField("password", v)}
            />

            <ButtonComponent disabled={isLoading} className="w-full">
              Kirish{isLoading && "..."}
            </ButtonComponent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
