import { Logo } from "@/components/Logo";

const loading = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Logo loading={true} mobile={false} />
    </div>
  );
};

export default loading;
