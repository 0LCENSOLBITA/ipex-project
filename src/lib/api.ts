const BASE_URL =
  "http://localhost:5000/api";

const jsonHeaders = {
  "Content-Type":
    "application/json",
};

async function request(
  url: string,
  options?: RequestInit
) {
 const token =
  localStorage.getItem(
    "token"
  );

const headers = {

  ...(options?.headers || {}),

  Authorization:
    token
      ? `Bearer ${token}`
      : "",
};

const res =
  await fetch(

    `${BASE_URL}${url}`,

    {
      ...options,
      headers,
    }
  );

  if (!res.ok) {
    const error =
      await res.json();

    throw new Error(
      error.error ||
      "Request failed"
    );
  }

  return res.json();
}

export const api = {

  // ======================
  // BUSINESS UNITS
  // ======================

  getBusinessUnits:
    async () =>
      request(
        "/business-units"
      ),

  createBusinessUnit:
    async (data: any) =>
      request(
        "/business-units",
        {
          method: "POST",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  // ======================
  // PROJECT TYPES
  // ======================

  getProjectTypes:
    async () =>
      request(
        "/project-types"
      ),

  getProjectTypesByBU:
    async (
      buId: string
    ) =>
      request(
        `/project-types/by-business-unit/${buId}`
      ),

  createProjectType:
    async (data: any) =>
      request(
        "/project-types",
        {
          method: "POST",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  updateProjectType:
    async (
      id: string,
      data: any
    ) =>
      request(
        `/project-types/${id}`,
        {
          method: "PUT",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  // ======================
  // CLIENTS
  // ======================

  getClients:
    async () =>
      request("/clients"),

  createClient:
    async (data: any) =>
      request(
        "/clients",
        {
          method: "POST",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  updatePricing:
    async (
      id: string,
      data: any
    ) =>
      request(
        `/clients/${id}/pricing`,
        {
          method: "PATCH",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  // ======================
  // SUBMISSIONS
  // ======================

  createSubmission:
    async (data: any) =>
      request(
        "/submissions",
        {
          method: "POST",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  getSubmissions: async (
  role?: string,
  userId?: string
) => {

  const params =
    new URLSearchParams();

  if (role) {

    params.append(
      "role",
      role
    );
  }

  if (userId) {

    params.append(
      "userId",
      userId
    );
  }

  const res =
    await fetch(

      `${BASE_URL}/submissions?${
        params.toString()
      }`
    );

  return res.json();
},

  updateStatus:
    async (
      id: string,
      status: string
    ) =>
      request(
        `/submissions/${id}/status`,
        {
          method: "PATCH",

          headers:
            jsonHeaders,

          body:
            JSON.stringify({
              status,
            }),
        }
      ),

  // ======================
  // FILE UPLOAD
  // ======================

  uploadFiles:
    async (
      files: File[]
    ) => {

      const formData =
        new FormData();

      files.forEach(
        (file) => {
          formData.append(
            "files",
            file
          );
        }
      );

      const res =
        await fetch(
          `${BASE_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      return res.json();
    },

  // ======================
  // AI
  // ======================

  validateBrief:
    async (data: any) =>
      request(
        "/ai/validate",
        {
          method: "POST",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  generateQuote:
    async (data: any) =>
      request(
        "/ai/generate-quote",
        {
          method: "POST",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  // ======================
  // USERS
  // ======================

  getUsers:
    async () =>
      request("/users"),

  createUser:
    async (data: any) =>
      request(
        "/users",
        {
          method: "POST",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  updateUser:
    async (
      id: string,
      data: any
    ) =>
      request(
        `/users/${id}`,
        {
          method: "PUT",

          headers:
            jsonHeaders,

          body:
            JSON.stringify(
              data
            ),
        }
      ),

  deleteUser:
    async (
      id: string
    ) =>
      request(
        `/users/${id}`,
        {
          method: "DELETE",
        }
      ),
};