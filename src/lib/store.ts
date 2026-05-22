import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SubmissionState = {
  clientId: string | null;

  buId: string | null;

  projectType: string | null;

  title: string;

  description: string;

  audience: string;

  deadline: string;

  budget: string;

  // ✅ AI

  aiAnswers: Record<
    string,
    string
  >;

  setAiAnswers: (
    v: Record<
      string,
      string
    >
  ) => void;

  // ✅ QUOTE

  quote: any;

  // ✅ FILES

  attachments: {
    name?: string;

    file?: File;

    description: string;
  }[];

  // ✅ DYNAMIC FORM

  formData: Record<
    string,
    any
  >;

  setFormData: (
    data: Record<
      string,
      any
    >
  ) => void;

  // ROUTING

  setClient: (
    id: string
  ) => void;

  setBu: (
    id: string
  ) => void;

  setType: (
    t: string
  ) => void;

  patch: (
    p: Partial<
      Omit<
        SubmissionState,

        | "patch"

        | "setBu"

        | "setType"

        | "setClient"

        | "reset"

        | "setFormData"

        | "setAiAnswers"
      >
    >
  ) => void;

  reset: () => void;
};

export const useSubmission =
create<SubmissionState>()(

persist(

(set) => ({

// CLIENT

clientId: null,

// BU

buId: null,

// PT

projectType: null,

// DETAILS

title: "",

description: "",

audience: "",

deadline: "",

budget: "",

// AI

aiAnswers: {},

// QUOTE

quote: null,

// FILES

attachments: [],

// FORM

formData: {},

// SETTERS

setFormData: (
data
) =>
set({

formData:
data,

}),

setAiAnswers: (
v
) =>

set({

aiAnswers:
v,

}),

setClient: (
id
) =>

set({

clientId:
id,

}),

setBu: (
id
) =>

set({

buId:
id,

}),

setType: (
t
) =>

set({

projectType:
t,

}),

// PATCH

patch: (
p
) =>

set(
(
state
) => ({

...state,

...p,

})
),

// RESET

reset: () =>

set({

clientId:
null,

buId:
null,

projectType:
null,

title: "",

description: "",

audience: "",

deadline: "",

budget: "",

aiAnswers: {},

quote: null,

attachments: [],

formData: {},

}),

}),

{
name:
"ipex-submission",
}

)

);