import type { APIRoute } from "astro";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { values, getUserFromUrl } = await request.json();

    const id = uuidv4();
    const now = new Date();
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Bangkok",
    };
    //@ts-ignore
    const timestamp = now.toLocaleString("en-GB", options);

    const formData = new FormData();
    formData.append("ID", id);
    formData.append("COMPANY", values.companyName);
    formData.append("EMAIL", values.email);
    formData.append("FIRSTNAME", values.firstName);
    formData.append("LASTNAME", values.lastName);
    formData.append("JOBPOSITION", values.jobPosition);
    formData.append("TIMESTAMP", timestamp);
    formData.append("PHONE", values.phoneNumber);
    formData.append("TERMS", values.terms);
    formData.append("USERFROM", getUserFromUrl);

    const response = await axios.post(
      `${import.meta.env.GOOGLE_SHEET_REGISTER}`,
      formData
    );

    if (response.data === "Email already exists") {
      return new Response(JSON.stringify(response.data), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      });
    }

    // get session ID TaxiMail
    // const { data: resTaxiMail } = await axios.post(
    //   "https://api.taximail.com/v2/user/login",
    //   {
    //     api_key: import.meta.env.TAXI_MAIL_API_KEY,
    //     secret_key: import.meta.env.TAXI_MAIL_SECRET_KEY,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    //Data for sending mail

    const dataSendMail = {
      transactional_group_name: "Default",
      subject: import.meta.env.EMAIL_SUBJECT,
      to_email: values.email,
      from_name: import.meta.env.EMAIL_FORM_NAME,
      from_email: import.meta.env.EMAIL_FORM_EMAIL,
      template_key: import.meta.env.EMAIL_TEMPLATE_KEY,
      content_html: `{"CF_FirstName":"${values.firstName}","CF_LastName":"${values.lastName}","CF_Email":"${values.email}","CF_Phone":"${values.phoneNumber}","CF_JobPosition":"${values.jobPosition}","CF_Company":"${values.companyName}"}`,
      report_type: "Full",
    };

    const sendEmail = await axios.post(
      "https://api.taximail.com/v2/transactional",
      dataSendMail,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.TAXI_MAIL_SESSION_ID}`,
        },
      }
    );

    return new Response(JSON.stringify(sendEmail.data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

    // return new Response(
    //   JSON.stringify({ message: "Somting want wrong, Please try again." }),
    //   {
    //     status: 500,
    //   }
    // );
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
