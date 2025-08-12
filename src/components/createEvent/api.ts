import { graphql } from "~/graphql";

export const eventsPageCreateRequestMutation = graphql(`
  mutation createEventRequest($event: CreateEventRequestInput!) {
    createEventRequest(event: $event) {
      id
      createdAt
      status
      event {
        id
        title
        duration
        description
        startTime
        expertEvent {
          promoWord
        }
      }
    }
  }
`);
