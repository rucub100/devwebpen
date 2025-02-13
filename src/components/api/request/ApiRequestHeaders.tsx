import NameValueTable from "../../common/NameValueTable";

export default function ApiRequestHeaders() {
  return (
    <div>
      <NameValueTable data={{ test: ["test", "test"] }}></NameValueTable>
    </div>
  );
}
