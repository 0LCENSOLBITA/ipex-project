import { UPLOADS_URL } from "@/lib/config";

export default function SubmissionDetailsModal({
  submission,
  onClose,
}: any) {

  if (!submission) return null;

  console.log(
    "MODAL OPEN",
    submission
  );
console.log(
"PROJECT TYPE:",
submission.projectType
);

console.log(
"QUOTE:",
submission.quote
);

console.log(
"AI:",
submission.aiAnswers
);
  return (

    <div className="
    fixed
    inset-0
    bg-black/50
    z-[9999]
    flex
    items-center
    justify-center
    p-6
    ">

      <div className="
      bg-white
      rounded-3xl
      shadow-2xl
      w-full
      max-w-4xl
      max-h-[90vh]
      overflow-y-auto
      animate-in
      fade-in
      zoom-in-95
      duration-200
      ">

        {/* HEADER */}

        <div className="
        sticky
        top-0
        bg-white
        border-b
        px-8
        py-6
        flex
        items-center
        justify-between
        rounded-t-3xl
        ">

          <div>

            <h2 className="
            text-2xl
            font-semibold
            ">
              {
                submission.data?.title ||
                "Untitled Submission"
              }
            </h2>

            <p className="
            text-sm
            text-muted-foreground
            mt-1
            ">
              {
                submission.submissionNumber
              }
            </p>

          </div>

          <button
            onClick={onClose}
            className="
            text-sm
            text-muted-foreground
            hover:text-black
            transition
            "
          >
            Close
          </button>

        </div>

        <div className="
        p-8
        space-y-8
        ">

          {/* TOP GRID */}

          <div className="
          grid
          grid-cols-2
          gap-6
          ">

            <div className="
            border
            rounded-2xl
            p-5
            ">

              <div className="
              text-xs
              text-muted-foreground
              mb-2
              ">
                Client
              </div>

              <div className="font-medium">
                {
                  submission.client?.name ||
                  "N/A"
                }
              </div>

            </div>

            <div className="
            border
            rounded-2xl
            p-5
            ">

              <div className="
              text-xs
              text-muted-foreground
              mb-2
              ">
                Business Unit
              </div>

              <div className="font-medium">
                {
                  submission.businessUnit?.name ||
                  "N/A"
                }
              </div>

            </div>

            <div className="
            border
            rounded-2xl
            p-5
            ">

              <div className="
              text-xs
              text-muted-foreground
              mb-2
              ">
                Project Type
              </div>

           <div className="font-medium">
{
  submission.projectType?.name ||

  submission.projectType?.title ||

  "N/A"
}
</div>

            </div>

            <div className="
            border
            rounded-2xl
            p-5
            ">

              <div className="
              text-xs
              text-muted-foreground
              mb-2
              ">
                Budget
              </div>

              <div className="
              font-semibold
              text-green-600
              ">
                {
                  submission.data?.budget ||
                  "N/A"
                }
              </div>

            </div>

          </div>

          {/* SUBMISSION DETAILS */}

          <div className="
          border
          rounded-2xl
          p-6
          ">

            <div className="
            text-sm
            font-medium
            mb-6
            ">
              Submission Details
            </div>

            <div className="space-y-6">

              {
                Object.entries(
                  submission.data || {}
                ).map(
                  ([key,value]:any,i)=>{

                    if(
                      key==="title" ||
                      key==="budget"
                    ){
                      return null;
                    }

                    return(

                      <div key={i}>

                        <div className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-muted-foreground
                        mb-2
                        ">

                          {
                            key
                            .replace(
                              /([A-Z])/g,
                              " $1"
                            )
                            .replace(
                              /^./,
                              (s:string)=>
                              s.toUpperCase()
                            )
                          }

                        </div>

                        <div className="
                        text-sm
                        leading-7
                        whitespace-pre-wrap
                        text-neutral-800
                        ">

                          {
                            String(
                              value ||
                              "N/A"
                            )
                          }

                        </div>

                      </div>

                    );
                  }
                )
              }

            </div>

          </div>

          {/* AI VALIDATION RESULTS */}

          {
            submission.aiAnswers &&
            Object.keys(submission.aiAnswers).length > 0 &&
            (
              <div className="
              border
              rounded-2xl
              p-6
              ">

                <div className="
                text-sm
                font-medium
                mb-6
                ">
                  AI Validation Results
                </div>

                <div className="space-y-5">

                  {
                    Object.entries(
                      submission.aiAnswers
                    ).map(
                      ([question, answer]: any, i) => (

                        <div key={i}>

                          <div className="
                          text-xs
                          uppercase
                          tracking-wide
                          text-muted-foreground
                          mb-1
                          ">
                            Question
                          </div>

                          <div className="
                          text-sm
                          font-medium
                          text-neutral-800
                          mb-2
                          ">
                            {question}
                          </div>

                          <div className="
                          text-xs
                          uppercase
                          tracking-wide
                          text-muted-foreground
                          mb-1
                          ">
                            Answer
                          </div>

                          <div className="
                          text-sm
                          leading-7
                          text-neutral-700
                          whitespace-pre-wrap
                          ">
                            {
                              typeof answer === "object"
                                ? JSON.stringify(answer, null, 2)
                                : String(answer ?? "N/A")
                            }
                          </div>

                        </div>

                      )
                    )
                  }

                </div>

              </div>
            )
          }

          {/* QUOTE */}

          <div className="
          border
          rounded-2xl
          p-6
          ">

            <div className="
            flex
            items-center
            justify-between
            mb-6
            ">

              <div>

                <div className="
                text-sm
                font-medium
                ">
                  AI Quote Estimate
                </div>

                <div className="
                text-xs
                text-muted-foreground
                mt-1
                ">
                  Generated project estimate
                </div>

              </div>

              <div className="
              text-3xl
              font-bold
              text-green-600
              ">

                {
                  submission.quote?.price
                    ? `$${Number(submission.quote.price).toLocaleString()}`
                    : "N/A"
                }

              </div>

            </div>

            <div className="
            text-sm
            leading-7
            text-neutral-700
            mb-4
            ">

              {
                submission.quote?.reason ||
                "No quote reason provided."
              }

            </div>

            {
              submission.quote?.breakdown?.length > 0 &&
              (
                <div className="
                border-t
                pt-4
                space-y-2
                ">

                  <div className="
                  text-xs
                  uppercase
                  tracking-wide
                  text-muted-foreground
                  mb-3
                  ">
                    Breakdown
                  </div>

                  {
                    submission.quote.breakdown.map(
                      (item: any, i: number) => (

                        <div
                          key={i}
                          className="
                          flex
                          items-center
                          justify-between
                          text-sm
                          "
                        >

                          <span className="text-neutral-700">
                            {item.label ?? "Item"}
                          </span>

                          <span className="font-medium text-neutral-900">
                            {
                              item.amount != null
                                ? `$${Number(item.amount).toLocaleString()}`
                                : "N/A"
                            }
                          </span>

                        </div>

                      )
                    )
                  }

                </div>
              )
            }

          </div>

          {/* ATTACHMENTS */}

          <div className="
          border
          rounded-2xl
          p-6
          space-y-4
          ">

            <div className="
            font-medium
            text-lg
            ">
              Attachments
            </div>

            {
              submission.attachments?.length > 0

              ? (

                <div className="space-y-3">

                  {
                    submission.attachments.map(
                      (
                        file:any,
                        i:number
                      )=>(

                        <div
                          key={i}
                          onClick={() => {
                            const base = UPLOADS_URL;
                            const resolvedUrl = file.path
                              ? encodeURI(
                                  `${base}${
                                    file.path.includes("C:")
                                      ? `/uploads/${file.path.split("\\").pop()}`
                                      : file.path
                                  }`
                                )
                              : encodeURI(
                                  `${base}/uploads/${file.filename || file.originalname}`
                                );
                            window.open(resolvedUrl, "_blank");
                          }}
                          className="
                          border
                          rounded-xl
                          p-4
                          hover:bg-neutral-50
                          transition
                          cursor-pointer
                          "
                        >

                          <div className="font-medium">
                            {
                              file.originalname ||
                              file.filename
                            }
                          </div>

                          <div className="
                          text-sm
                          text-muted-foreground
                          ">
                            {
                              file.description ||
                              "No description"
                            }
                          </div>

                        </div>

                      )
                    )
                  }

                </div>

              )

              : (

                <div className="
                text-sm
                text-muted-foreground
                ">
                  No attachments uploaded.
                </div>

              )
            }

          </div>

          {/* FOOTER */}

          <div className="
          border-t
          pt-6
          flex
          items-center
          justify-between
          text-xs
          text-muted-foreground
          ">

            <div>

              Created:

              {" "}

              {
                new Date(
                  submission.createdAt
                ).toLocaleString()
              }

            </div>

            <div>

              Status:

              {" "}

              {
                submission.status
              }

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}