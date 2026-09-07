import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { USER_ROLES } from "@/contracts/auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: [USER_ROLES.customer, USER_ROLES.admin],
          required: true,
          defaultValue: USER_ROLES.customer,
          input: false,
        },
      },
    }),
  ],
});
