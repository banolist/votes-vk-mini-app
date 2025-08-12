import { graphql } from "~/graphql";

export const myProfileRequest = graphql(`
  query myProfileRequest($argType: ProfileRequestType!) {
    myProfileRequest(type: $argType) {
      id
      status
      expertRequest {
        newSimpleSpeechLink
        newSocialMediaLink
        newFirstName
        newLastName
        newAbout
        newReferUsername
        newRegion {
          id
        }
        newCommunityDirections {
          id
        }
      }
      organizatorRequest {
        newOrganizationName
        newOrganizationURL
      }
    }
  }
`);

export const eventsListQuery = graphql(`
  query eventsList(
    $first: Int!
    $after: Cursor
    $filter: EventWhereInput
    $orderBy: EventOrder
  ) {
    events(first: $first, after: $after, where: $filter, orderBy: $orderBy) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          id
          title
          type
          startTime
          endTime
          duration
          updatedAt
          createdAt
          description
        }
      }
    }
  }
`);
export const eventCardPageQuery = graphql(`
  query eventCardPage($id: ID!) {
    event(id: $id) {
      startTime
      type
      duration
      createdAt
      title
      updatedAt
      endTime
      description
      promoWorld
      expertEvent {
        link
        commentToListener
        promoWord
      }
      organizatorEvent {
        feeType
      }
      myExpertVote
      creator {
        firstName
        lastName
        id
        nickname
        username
        avatar
        rights
        expertProfile {
          about
          countEvents
          votesCount
          peopleVotesCount
          region {
            regionName
          }
          id
        }
      }
      id
    }
  }
`);

export const profileEventsQuery = graphql(`
  query ProfileEvents(
    $first: Int
    $after: Cursor
    $where: EventRequestWhereInput
  ) {
    myEventRequests(
      first: $first
      after: $after
      orderBy: { direction: DESC, field: CREATED_AT }
      where: $where
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      edges {
        node {
          id
          createdAt
          status
          rejectComment
          event {
            id
            title
            duration
            startTime
            type
            description
            expertEvent {
              promoWord
            }
            organizatorEvent {
              feeType
              place
              speakerBenefits
              targetAudience {
                id
              }
              topic
              transferPaid
              verificationMode
            }
          }
        }
        cursor
      }
      totalCount
    }
  }
`);
export const expertResponseToEventQuery = graphql(`
  query expertResponcesToOrganizaotorEvents(
    $first: Int!
    $after: Cursor
    $where: ExpertResponseToEventWhereInput
  ) {
    expertResponseToEvents(first: $first, after: $after, where: $where) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
      edges {
        cursor
        node {
          createdAt
          id
          status
          type
          user {
            id
            firstName
            lastName
            avatar
            expertProfile {
              about
              region {
                regionName
              }
            }
          }
          updatedAt
        }
      }
    }
  }
`);
export const inviteExpertToOrganizatorEvent = graphql(`
  mutation inviteExpertToOrganizatorEvent(
    $data: CreateInviteToOrganizatorEvent!
  ) {
    createInviteToOrganizatorEvent(data: $data) {
      id
    }
  }
`);

export const acceptRespnceExpertToOrganizatorEventMutation = graphql(`
  mutation acceptRespnceExpertToOrganizatorEvent(
    $id: ID!
    $data: CreateChildOrganizatorEventInput!
  ) {
    acceptResponOrganizatorEvent(responceID: $id, data: $data) {
      id
    }
  }
`);

export const rejectRespnceExpertToOrganizatorEventMutation = graphql(`
  mutation rejectRespnceExpertToOrganizatorEvent($id: ID!) {
    rejectRespondOrganizatorEvent(responceID: $id) {
      id
    }
  }
`);
