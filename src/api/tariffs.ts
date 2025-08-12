import { graphql } from "~/graphql";

export const tariffUpdateMutation = graphql(`
  mutation updateTariff($id: ID!, $data: UpdateTariffInput!) {
    updateTariff(id: $id, data: $data) {
      id
    }
  }
`);
export const tariffsControlListQuery = graphql(`
  query tariffsControlList {
    tariffs {
      active
      title
      updatedAt
      joinProfessionalCommunities
      mailingPerMonth
      numberExpertsManagedByOneRepresentative
      organizerExpertsOnEvent
      organizerFeeEventMailingPriceExpert
      organizerInviteMailingPriceExpert
      organizerPerEvent
      organizerRequestExpertAboutPrice
      paidEventResponsesPerMonth
      paidRequestPublicationPrice
      activeWordDurationHours
      price
      referralBonus
      referralPrice
      votesPerEvent
      countExpertsInCreateCommunity
      createProfessionalCommunities
      eventsPerMonth
      id
    }
  }
`);
