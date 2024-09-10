import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return userInfo ? <Dashboard /> : <Hero />;
};
export default HomeScreen;
