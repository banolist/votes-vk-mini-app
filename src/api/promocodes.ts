import { graphql } from "~/graphql";

export const promocodesListQuery = graphql(`
  query promocodesList($first: Int!, $after: Cursor) {
    promocodes(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          active
          startAt
          updatedAt
          code
          createdAt
          maxCountActivations
          maxMouthSubscriptionDuration
          maxUserCountActivations
          activatedCount
          discount
          endAt
        }
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`);
