const requestStatus: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

export function parseRequestStatusToName(permission: string): string {
  return requestStatus[permission];
}

export function getAvailableRequestStatus(): { value: string; name: string }[] {
  return Object.keys(requestStatus).map((key: string) => ({
    value: key,
    name: requestStatus[key],
  }));
}
