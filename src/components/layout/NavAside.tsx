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
import { ReactNode } from "react";
import { NavView } from "../../types/view-state";
import NavStart from "../navigation/NavStart";
import NavProxy from "../navigation/NavProxy";
import NavApiClient from "../navigation/NavApiClient";

const components: Record<NavView, ReactNode> = {
  none: undefined,
  dashboard: <NavStart></NavStart>,
  proxy: <NavProxy></NavProxy>,
  apiClient: <NavApiClient></NavApiClient>,
};

interface NavAsideProps {
  navigation?: NavView;
}

export default function NavAside({ navigation }: NavAsideProps) {
  const component = navigation ? components[navigation] : null;
  return <>{component}</>;
}
