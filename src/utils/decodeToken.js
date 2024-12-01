const decodeToken = (token) => {
  try {
    // JWT는 세 부분으로 나뉘어야 함: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT structure");
    }

    // Base64 URL-safe decoding
    const base64Payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base64Payload); // Base64 decoding
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export default decodeToken;
