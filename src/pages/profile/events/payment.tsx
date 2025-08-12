import { Button } from "@kobalte/core/button";
import { createForm, getError, zodForm } from "@modular-forms/solid";
import { useNavigate, useParams } from "@solidjs/router";
import { Show, type Component } from "solid-js";
import { TextField } from "~/components/form/TextField";
import Page from "~/components/ui/Page";
import { graphql } from "~/graphql";
import { z } from "~/i18n/i18n";
import execute from "~/utils/execute";

const paymentEventMutatuion = graphql(`
  mutation paymentEvent($data: CreatePaymentLinkEvent!) {
    createPaidLinkEvent(data: $data)
  }
`);

const paymentSchema = z.object({
  email: z.string().email(),
});

type PaymentForm = typeof paymentSchema._type;

const EventPaymentPage: Component = () => {
  const { id } = useParams();
  const [form, { Form, Field }] = createForm<PaymentForm>({
    validate: zodForm(paymentSchema),
  });
  // const navigate = useNavigate();

  const handleSubmit = async (data: PaymentForm) => {
    const request = await execute(paymentEventMutatuion, {
      data: {
        id,
        email: data.email,
        returnURL: window.location.origin + "/events/" + id,
      },
    });
    window.location.href = request.createPaidLinkEvent;
  };
  return (
    <Page title="Оплата мероприятия">
      <Form onSubmit={handleSubmit}>
        <Field name="email">
          {(field, props) => (
            <TextField
              {...props}
              label="Электронная почта"
              type="email"
              value={field.value}
              error={field.error}
              required
            />
          )}
        </Field>
        {/* <Show when={form.validating}>{form.validating}</Show> */}
        <Button
          type="submit"
          class="btn btn-primary w-full mt-2"
          disabled={form.submitting}
        >
          Оплатить
        </Button>
      </Form>
    </Page>
  );
};
export default EventPaymentPage;
