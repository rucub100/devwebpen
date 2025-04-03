/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
