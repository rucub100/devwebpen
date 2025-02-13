import { HTMLAttributes } from "react";

interface NameValueTableProps extends HTMLAttributes<HTMLTableElement> {
  data: Record<string, [string, string]>;
  className?: string;
  onNameChange?: (key: string, name: string) => void;
  onValueChange?: (key: string, value: string) => void;
}

export default function NameValueTable({
  data,
  className,
  onNameChange,
  onValueChange,
  ...props
}: NameValueTableProps) {
  return (
    <table
      className={`border-separate border-spacing-2 w-full ${className}`}
      {...props}
    >
      <tbody className="">
        {Object.entries(data).map(([key, [name, value]]) => (
          <tr key={key}>
            <td className="">
              <input
                type="text"
                value={name}
                className="w-full"
                onChange={() => onNameChange?.(key, name)}
              ></input>
            </td>
            <td className="">
              <input
                type="text"
                value={value}
                className="w-full"
                onChange={() => onValueChange?.(key, value)}
              ></input>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
