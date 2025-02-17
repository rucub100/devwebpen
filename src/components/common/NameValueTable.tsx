import { HTMLAttributes } from "react";
import Icon from "./Icon";
import IconButton from "./IconButton";

interface NameValueTableProps extends HTMLAttributes<HTMLTableElement> {
  data: Record<string, [string, string]>;
  className?: string;
  onNameChange: (key: string, name: string) => void;
  onValueChange: (key: string, value: string) => void;
  onDelete: (key: string) => void;
}

export default function NameValueTable({
  data,
  className,
  onNameChange,
  onValueChange,
  onDelete,
  ...props
}: NameValueTableProps) {
  return (
    <table className={`w-full ${className}`} {...props}>
      <colgroup>
        <col className="w-[30%] @7xl:w-[42ch]"></col>
        <col className="w-4"></col>
        <col></col>
        <col className="w-6"></col>
      </colgroup>
      <tbody>
        {Object.entries(data).map(([key, [name, value]]) => (
          <tr key={key} className="align-middle">
            <td>
              <input
                type="text"
                value={name}
                className="w-full px-1"
                onChange={(event) => onNameChange(key, event.target.value)}
              ></input>
            </td>
            <td>:</td>
            <td>
              <input
                type="text"
                value={value}
                className="w-full px-1"
                onChange={(event) => onValueChange(key, event.target.value)}
              ></input>
            </td>
            <td>
              <div className="flex items-center justify-center" title="Delete">
                <IconButton
                  icon={<Icon icon="delete"></Icon>}
                  onClick={() => onDelete(key)}
                ></IconButton>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
