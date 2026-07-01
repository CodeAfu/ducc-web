import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "~/components/TextInput";
import { formSchema, TFormSchema } from "../-types";
import AnimatedButton from "~/components/AnimatedButton";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CopiumForm() {
  const { register, handleSubmit } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<TFormSchema> = (data) => {
    console.log("Submitting form with: ", data);
  };

  return (
    <form className="flex gap-4 mb-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col flex-1 gap-3">
        <TextInput
          {...register("user")}
          name="user"
          label="username"
          className="w-full"
        />
        <TextInput
          {...register("subreddit")}
          name="subreddit"
          label="subreddit"
          className="w-full"
        />
      </div>
      <AnimatedButton type="submit" className="min-w-24">
        Search
      </AnimatedButton>
    </form>
  );
}
