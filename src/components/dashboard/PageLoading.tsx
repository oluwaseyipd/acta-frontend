
const PageLoading = () => {


return (
    <div className="flex justify-center items-center gap-2 h-full">
        <div className="w-5 h-5 bg-orange-100 rounded animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-5 h-5 bg-orange-100 rounded animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-5 h-5 bg-orange-100 rounded animate-bounce"></div>
    </div>
  );
};

export default PageLoading;