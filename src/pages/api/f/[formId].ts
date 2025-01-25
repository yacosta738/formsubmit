import type { APIRoute } from "astro";
import { supabase } from '../../../lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request, params }) => {
  const formId = params.formId;
  const formData = await request.formData();
  const formFields: Record<string, string> = {};
  
  // Collect form data
  formData.forEach((value, key) => {
    formFields[key] = value.toString();
  });

  try {
    // Get form configuration
    const { data: formConfig } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (!formConfig) {
      return new Response(JSON.stringify({ error: 'Form not found' }), {
        status: 404
      });
    }

    // Store submission
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          form_id: formId,
          data: formFields,
          email: formFields.email
        }
      ]);

    if (error) throw error;

    // Send notification if configured
    if (formConfig.notify_email) {
      await resend.emails.send({
        from: 'notifications@yourdomain.com',
        to: formConfig.notify_email,
        subject: 'New Form Submission',
        html: `<p>You received a new submission for form: ${formConfig.name}</p>
              <pre>${JSON.stringify(formFields, null, 2)}</pre>`
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500
    });
  }
};
