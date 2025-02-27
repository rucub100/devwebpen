interface ApiResponseBodyProps {
  body?: Uint8Array;
}

const textDecoder = new TextDecoder();

export default function ApiResponseBody({ body }: ApiResponseBodyProps) {
  const bodyText = body ? textDecoder.decode(Uint8Array.from(body).buffer) : "";

  return (
    <textarea
      className="w-full h-full p-2 bg-neutral-950 text-neutral-100 resize-none outline-none"
      readOnly
      aria-readonly
      value={bodyText}
    ></textarea>
  );
}
