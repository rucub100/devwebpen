import { useCallback, useEffect, useState } from "react";
import { createContextMenu } from "../tauri/context-menu";
import { ContextMenu } from "../types/context-menu";

export function useContextMenu(contextMenu: ContextMenu) {
  const [menu, setMenu] = useState<Awaited<
    ReturnType<typeof createContextMenu>
  > | null>(null);

  useEffect(() => {
    createContextMenu(contextMenu).then((ctxMenu) => setMenu(ctxMenu));
  }, [contextMenu]);

  const showContextMenu = useCallback(
    (event: React.MouseEvent) => {
      menu?.show(event);
    },
    [menu]
  );

  return showContextMenu;
}
