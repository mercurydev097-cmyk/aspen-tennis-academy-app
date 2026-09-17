import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { currentUser } from "../data/mockData";

export function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState("");

  return (
    <div className="px-6 pb-8 pt-10">
      <ScreenHeader title="Edit Profile" subtitle="Update your account details." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/profile");
        }}
        className="flex flex-col gap-4"
      >
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="e.g. (555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button fullWidth type="submit" className="mt-4">
          Save Changes <Check size={16} />
        </Button>
      </form>
    </div>
  );
}
