import { NewPostForm } from "../forms/NewPostForm";

const NewPostPage: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">New Post</h1>
      <div className="max-w-4xl w-full">
        <NewPostForm />
      </div>
    </div>
  );
};

export default NewPostPage;
