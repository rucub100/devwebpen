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
    <table className={`w-full ${className}`} {...props}>
      <colgroup>
        <col className="w-[30%] @7xl:w-[42ch]"></col>
        <col className="w-4"></col>
      </colgroup>
      <tbody>
        {Object.entries(data).map(([key, [name, value]]) => (
          <tr key={key}>
            <td>
              <input
                type="text"
                value={name}
                className="w-full"
                onChange={() => onNameChange?.(key, name)}
              ></input>
            </td>
            <td>:</td>
            <td>
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
