interface ApiRequestBodyProps {
  body: string | ArrayBuffer | null;
}

export default function ApiRequestBody({ body }: ApiRequestBodyProps) {
  return (
    <div className="flex flex-col">
      <select className="py-1 cursor-pointer self-end mr-2 my-1">
        <option value="NO_BODY">No Body</option>
      </select>
      <div className="h-0 w-full border-b border-neutral-800"></div>
    </div>
  );
}
