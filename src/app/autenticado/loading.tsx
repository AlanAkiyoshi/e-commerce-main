import React from "react";

import { Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <div>
      <Skeleton variant="rounded" width={210} height={60} />
    </div>
  );
}
