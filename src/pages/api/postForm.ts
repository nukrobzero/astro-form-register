import type { APIRoute } from "astro";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { values } = await request.json();

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
    //get session ID TaxiMail
    const resTaxiMail = await axios.post(
      "https://api.taximail.com/v2/user/login",
      {
        api_key: import.meta.env.TAXI_MAIL_API_KEY,
        secret_key: import.meta.env.TAXI_MAIL_SECRET_KEY,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!resTaxiMail) {
      return new Response(JSON.stringify(resTaxiMail), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Data for sending mail
    if (resTaxiMail) {
      const dataSendMail = {
        transactional_group_name: "Default",
        subject: "Ticket for Sumipol x Metalex 2023",
        to_email: values.email,
        from_name: "Sumipol",
        from_email: "no-reply@sumipol.com",
        template_key: "15858654dbc53ab876",
        content_html: `{"CF_FirstName":"${values.firstName}","CF_LastName":"${values.lastName}","CF_JobPosition":"${values.jobPosition}","CF_Company":"${values.companyName}"}`,
        report_type: "Full",
      };

      const sendEmail = await axios.post(
        "https://api.taximail.com/v2/transactional",
        dataSendMail,
        {
          headers: {
            Authorization: `Bearer ${resTaxiMail.data.data.session_id}`,
          },
        }
      );

      return new Response(JSON.stringify(sendEmail.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ message: "Somting want wrong" }), {
      status: 500,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
