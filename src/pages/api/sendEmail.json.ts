export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const formFields: Record<string, string> = {};
  
  // Dynamically collect all form fields
  formData.forEach((value, key) => {
    formFields[key] = value.toString();
  });

  // Validate that all fields have values
  if (Object.values(formFields).some(value => !value)) {
    return new Response(
      JSON.stringify({
        message: `Fill out all fields.`,
      }),
      {
        status: 404,
        statusText: "Did not provide the right data",
      },
    );
  }

  // Sending information to Resend
  const sendResend = await resend.emails.send({
    from: "support@resend.dev",
    to: "delivered@resend.dev",
    subject: `Submission from ${formFields.name}`,
    html: `<p>Hi ${formFields.name},</p><p>Your message was received.</p>`,
  });

  // If the message was sent successfully, return a 200 response
  if (sendResend.data) {
    return new Response(
      JSON.stringify({
        message: `Message successfully sent!`,
      }),
      {
        status: 200,
        statusText: "OK",
      },
    ); // If there was an error sending the message, return a 500 response
  } else {
    return new Response(
      JSON.stringify({
        message: `Message failed to send: ${sendResend.error}`,
      }),
      {
        status: 500,
        statusText: `Internal Server Error: ${sendResend.error}`,
      },
    );
  }
};