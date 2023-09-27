import { toast } from "react-toastify";

export const notify = (data) => {
  if (data.type == "error") return toast.error(data.mssg);
  if (data.type == "success") return toast.success(data.mssg);
  if (data.type == "warning") return toast.warning(data.mssg);

  return toast.success("Not available yet.", { icon: "🟢" });
};
