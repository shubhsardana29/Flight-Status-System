export function getBoardingStatus(status) {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "BOARDING":
        return "Now";
      case "DELAYED":
        return "Delayed";
      case "ON TIME":
        return "On Time";
      case "CANCELLED":
        return "Cancelled";
      case "LANDED":
        return "Landed";
      case "SCHEDULED":
        return "Soon";
      case "DEPARTED":
      case "ARRIVED":
        return "Completed";
      default:
        return "Soon";
    }
  }