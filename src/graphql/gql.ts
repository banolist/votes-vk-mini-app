/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query myProfileRequest($argType: ProfileRequestType!) {\n    myProfileRequest(type: $argType) {\n      id\n      status\n      expertRequest {\n        newSimpleSpeechLink\n        newSocialMediaLink\n        newFirstName\n        newLastName\n        newAbout\n        newReferUsername\n        newRegion {\n          id\n        }\n        newCommunityDirections {\n          id\n        }\n      }\n      organizatorRequest {\n        newOrganizationName\n        newOrganizationURL\n      }\n    }\n  }\n": typeof types.MyProfileRequestDocument,
    "\n  query eventsList(\n    $first: Int!\n    $after: Cursor\n    $filter: EventWhereInput\n    $orderBy: EventOrder\n  ) {\n    events(first: $first, after: $after, where: $filter, orderBy: $orderBy) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          id\n          title\n          type\n          startTime\n          endTime\n          duration\n          updatedAt\n          createdAt\n          description\n        }\n      }\n    }\n  }\n": typeof types.EventsListDocument,
    "\n  query eventCardPage($id: ID!) {\n    event(id: $id) {\n      startTime\n      type\n      duration\n      createdAt\n      title\n      updatedAt\n      endTime\n      description\n      promoWorld\n      expertEvent {\n        link\n        commentToListener\n        promoWord\n      }\n      organizatorEvent {\n        feeType\n      }\n      myExpertVote\n      creator {\n        firstName\n        lastName\n        id\n        nickname\n        username\n        avatar\n        rights\n        expertProfile {\n          about\n          countEvents\n          votesCount\n          peopleVotesCount\n          region {\n            regionName\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n": typeof types.EventCardPageDocument,
    "\n  query ProfileEvents(\n    $first: Int\n    $after: Cursor\n    $where: EventRequestWhereInput\n  ) {\n    myEventRequests(\n      first: $first\n      after: $after\n      orderBy: { direction: DESC, field: CREATED_AT }\n      where: $where\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        endCursor\n        startCursor\n      }\n      edges {\n        node {\n          id\n          createdAt\n          status\n          rejectComment\n          event {\n            id\n            title\n            duration\n            startTime\n            type\n            description\n            expertEvent {\n              promoWord\n            }\n            organizatorEvent {\n              feeType\n              place\n              speakerBenefits\n              targetAudience {\n                id\n              }\n              topic\n              transferPaid\n              verificationMode\n            }\n          }\n        }\n        cursor\n      }\n      totalCount\n    }\n  }\n": typeof types.ProfileEventsDocument,
    "\n  query expertResponcesToOrganizaotorEvents(\n    $first: Int!\n    $after: Cursor\n    $where: ExpertResponseToEventWhereInput\n  ) {\n    expertResponseToEvents(first: $first, after: $after, where: $where) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          createdAt\n          id\n          status\n          type\n          user {\n            id\n            firstName\n            lastName\n            avatar\n            expertProfile {\n              about\n              region {\n                regionName\n              }\n            }\n          }\n          updatedAt\n        }\n      }\n    }\n  }\n": typeof types.ExpertResponcesToOrganizaotorEventsDocument,
    "\n  mutation inviteExpertToOrganizatorEvent(\n    $data: CreateInviteToOrganizatorEvent!\n  ) {\n    createInviteToOrganizatorEvent(data: $data) {\n      id\n    }\n  }\n": typeof types.InviteExpertToOrganizatorEventDocument,
    "\n  mutation acceptRespnceExpertToOrganizatorEvent(\n    $id: ID!\n    $data: CreateChildOrganizatorEventInput!\n  ) {\n    acceptResponOrganizatorEvent(responceID: $id, data: $data) {\n      id\n    }\n  }\n": typeof types.AcceptRespnceExpertToOrganizatorEventDocument,
    "\n  mutation rejectRespnceExpertToOrganizatorEvent($id: ID!) {\n    rejectRespondOrganizatorEvent(responceID: $id) {\n      id\n    }\n  }\n": typeof types.RejectRespnceExpertToOrganizatorEventDocument,
    "\n  mutation CreateExpertRequest($input: ProfileCreateInput!) {\n    createProfileRequest(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateExpertRequestDocument,
    "\n  query getExpertProfile($id: ID!) {\n    user(id: $id) {\n      avatar\n      firstName\n      lastName\n      rights\n      platforms {\n        platformID\n        platform\n      }\n      expertProfile {\n        socialMediaLink\n        peopleRatingEnabled\n        referUsername\n        region {\n          regionName\n        }\n        communityDirections {\n          direction\n          name\n        }\n        votesCount\n        peopleVotesCount\n        countEvents\n        about\n        myExpertVote\n        myPeopleVote\n      }\n    }\n  }\n": typeof types.GetExpertProfileDocument,
    "\n  mutation assignTariff($data: AssignTariffInput!) {\n    assignTariff(data: $data)\n  }\n": typeof types.AssignTariffDocument,
    "\n  mutation voteInPeopleRaiting($data: CreateVoteInput!) {\n    createVote(data: $data) {\n      id\n    }\n  }\n": typeof types.VoteInPeopleRaitingDocument,
    "\n  mutation deletePeopleVote($data: DeleteVoteInput!) {\n    deleteVote(id: $data)\n  }\n": typeof types.DeletePeopleVoteDocument,
    "\n  mutation verificateUserFromAdmin($userID: ID!) {\n    verifiesUser(userID: $userID)\n  }\n": typeof types.VerificateUserFromAdminDocument,
    "\n  mutation preExpertRequestCreate(\n    $data: CreateRepresentativeExpertRequestInput!\n  ) {\n    createRepresentativeRequest(data: $data)\n  }\n": typeof types.PreExpertRequestCreateDocument,
    "\n  mutation assignAdminRightToExpert($id: ID!) {\n    assignAdminRights(userID: $id) {\n      id\n    }\n  }\n": typeof types.AssignAdminRightToExpertDocument,
    "\n  mutation deleteUserProfile {\n    deleteMyProfileUser\n  }\n": typeof types.DeleteUserProfileDocument,
    "\n  mutation deleteMyExpertProfile {\n    deleteMyProfileExpert\n  }\n": typeof types.DeleteMyExpertProfileDocument,
    "\n  mutation deleteMyOrganizaotorProfile {\n    deleteMyProfileOrganizator\n  }\n": typeof types.DeleteMyOrganizaotorProfileDocument,
    "\n  query promocodesList($first: Int!, $after: Cursor) {\n    promocodes(first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          active\n          startAt\n          updatedAt\n          code\n          createdAt\n          maxCountActivations\n          maxMouthSubscriptionDuration\n          maxUserCountActivations\n          activatedCount\n          discount\n          endAt\n        }\n      }\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n": typeof types.PromocodesListDocument,
    "\n  query settings {\n    settings {\n      notificationsFromExperts\n      peopleRatingEnabled\n    }\n  }\n": typeof types.SettingsDocument,
    "\n  mutation setSettings($data: SettingsValuesInput!) {\n    setSettings(data: $data) {\n      notificationsFromExperts\n      peopleRatingEnabled\n    }\n  }\n": typeof types.SetSettingsDocument,
    "\n  mutation updateTariff($id: ID!, $data: UpdateTariffInput!) {\n    updateTariff(id: $id, data: $data) {\n      id\n    }\n  }\n": typeof types.UpdateTariffDocument,
    "\n  query tariffsControlList {\n    tariffs {\n      active\n      title\n      updatedAt\n      joinProfessionalCommunities\n      mailingPerMonth\n      numberExpertsManagedByOneRepresentative\n      organizerExpertsOnEvent\n      organizerFeeEventMailingPriceExpert\n      organizerInviteMailingPriceExpert\n      organizerPerEvent\n      organizerRequestExpertAboutPrice\n      paidEventResponsesPerMonth\n      paidRequestPublicationPrice\n      activeWordDurationHours\n      price\n      referralBonus\n      referralPrice\n      votesPerEvent\n      countExpertsInCreateCommunity\n      createProfessionalCommunities\n      eventsPerMonth\n      id\n    }\n  }\n": typeof types.TariffsControlListDocument,
    "\n  query CommunityDirectionsCategorized {\n    communityDirectionsCategorized {\n      label\n      options {\n        id\n        name\n        direction\n      }\n    }\n  }\n": typeof types.CommunityDirectionsCategorizedDocument,
    "\n  mutation deleteEventRequest($id: ID!) {\n    deleteEventRequest(requestID: $id)\n  }\n": typeof types.DeleteEventRequestDocument,
    "\n  query regionsOptions {\n    regions {\n      regionName\n      id\n    }\n  }\n": typeof types.RegionsOptionsDocument,
    "\n  query tariffListOptionsQiery {\n    tariffs {\n      id\n      title\n    }\n  }\n": typeof types.TariffListOptionsQieryDocument,
    "\n  mutation createEventRequest($event: CreateEventRequestInput!) {\n    createEventRequest(event: $event) {\n      id\n      createdAt\n      status\n      event {\n        id\n        title\n        duration\n        description\n        startTime\n        expertEvent {\n          promoWord\n        }\n      }\n    }\n  }\n": typeof types.CreateEventRequestDocument,
    "\n  query Me {\n    me {\n      id\n      firstName\n      lastName\n      rights\n      agreesTermsAt\n      notifications(where: { readAtIsNil: true }) {\n        totalCount\n      }\n    }\n  }\n": typeof types.MeDocument,
    "\n  query myTariffLimits {\n    me {\n      id\n      tariffLimits {\n        votesPerEvent\n        eventsPerMonth\n        activeWordDurationHours\n      }\n    }\n  }\n": typeof types.MyTariffLimitsDocument,
    "\n  query homePage {\n    statistic {\n      eventsCount\n      eventsHoursCount\n      usersCount\n      votesCount\n    }\n  }\n": typeof types.HomePageDocument,
    "\n  query inputPromoWild($world: String! = \"\") {\n    inputEvent(promoWord: $world) {\n      id\n    }\n  }\n": typeof types.InputPromoWildDocument,
    "\n  mutation AcceptPlatformRights($data: acceptPlatformRightsInput!) {\n    acceptPlatformRights(data: $data)\n  }\n": typeof types.AcceptPlatformRightsDocument,
    "\n  query UsageRights {\n    platformRightsText\n  }\n": typeof types.UsageRightsDocument,
    "\n  mutation mailingAdmin($data: CreateNotificationInput!) {\n    createNotification(data: $data)\n  }\n": typeof types.MailingAdminDocument,
    "\n  query moderationCardEventRequest($id: ID!) {\n    eventRequest(id: $id) {\n      updatedAt\n      createdAt\n      verifiedAt\n      status\n      event {\n        startTime\n        duration\n        description\n        title\n        type\n        expertEvent {\n          commentToListener\n        }\n      }\n      creator {\n        id\n        firstName\n        lastName\n        nickname\n        avatar\n        expertProfile {\n          id\n          about\n          region {\n            regionName\n          }\n        }\n      }\n    }\n  }\n": typeof types.ModerationCardEventRequestDocument,
    "\n  mutation AcceptEventRequest($id: ID!, $withPayment: Boolean = false) {\n    acceptEvent(eventId: $id, withPayment: $withPayment)\n  }\n": typeof types.AcceptEventRequestDocument,
    "\n  mutation rejectEventRequest($id: ID!, $reason: String!) {\n    rejectEvent(eventId: $id, reason: $reason)\n  }\n": typeof types.RejectEventRequestDocument,
    "\n  query moderationEventsList($first: Int!, $after: Cursor) {\n    eventRequests(\n      first: $first\n      after: $after\n      where: { status: pending }\n      orderBy: { field: CREATED_AT, direction: DESC }\n    ) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        node {\n          id\n          createdAt\n\n          status\n          event {\n            type\n            description\n            startTime\n            duration\n            title\n            expertEvent {\n              commentToListener\n              promoWord\n            }\n          }\n        }\n        cursor\n      }\n      totalCount\n    }\n  }\n": typeof types.ModerationEventsListDocument,
    "\n  query profileRequest($id: ID!) {\n    ProfileRequest(id: $id) {\n      creator {\n        firstName\n        lastName\n        avatar\n      }\n      status\n      changeType\n      type\n      expertRequest {\n        newSocialMediaLink\n        newSimpleSpeechLink\n        newAbout\n        newFirstName\n        newLastName\n        newCommunityDirections {\n          direction\n          name\n        }\n        newReferUsername\n        newRegalia\n        newRegion {\n          regionName\n        }\n      }\n      organizatorRequest {\n        newOrganizationName\n        newOrganizationURL\n      }\n    }\n  }\n": typeof types.ProfileRequestDocument,
    "\n  mutation AcceptExpertRequect($id: ID!) {\n    acceptProfileRequest(requestId: $id) {\n      id\n    }\n  }\n": typeof types.AcceptExpertRequectDocument,
    "\n  mutation rejectProfileRequest($id: ID!, $reason: String!) {\n    rejectProfileRequest(requestId: $id, reason: $reason)\n  }\n": typeof types.RejectProfileRequestDocument,
    "\n  query moderationProfilesList($first: Int!, $cursor: Cursor) {\n    profileRequests(\n      first: $first\n      after: $cursor\n      where: { status: pending }\n      orderBy: { direction: DESC, field: CREATED_AT }\n    ) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          type\n          createdAt\n          changeType\n          creator {\n            firstName\n            lastName\n            avatar\n          }\n        }\n      }\n      totalCount\n    }\n  }\n": typeof types.ModerationProfilesListDocument,
    "\n  mutation createPromocode($data: CreatePromocodeInput!) {\n    createPromocode(data: $data) {\n      id\n      maxUserCountActivations\n      startAt\n      tariffs {\n        id\n        title\n      }\n      code\n      createdAt\n      discount\n      endAt\n      activatedCount\n      maxCountActivations\n      maxMouthSubscriptionDuration\n    }\n  }\n": typeof types.CreatePromocodeDocument,
    "\n  mutation usageRightWrite($text: String!) {\n    platformRightsTextWrite(text: $text)\n  }\n": typeof types.UsageRightWriteDocument,
    "\n  query searchExpert($query: String!) {\n    searchExpertToOrganizatorEvent(query: $query) {\n      id\n      firstName\n      lastName\n      avatar\n      nickname\n    }\n  }\n": typeof types.SearchExpertDocument,
    "\n  mutation voteInEvent($data: CreateVoteInput!) {\n    createVote(data: $data) {\n      id\n    }\n  }\n": typeof types.VoteInEventDocument,
    "\n  mutation deleteVoteInEvent($data: DeleteVoteInput!) {\n    deleteVote(id: $data)\n  }\n": typeof types.DeleteVoteInEventDocument,
    "\n  query votesResponce($eventID: ID!) {\n    analisticVotes(eventID: $eventID) {\n      deletedAt\n      event {\n        promoWorld\n        startTime\n        endTime\n        title\n      }\n      targetExpert {\n        user {\n          id\n          firstName\n          lastName\n          nickname\n        }\n      }\n      user {\n        firstName\n        lastName\n        nickname\n        id\n      }\n      isLike\n    }\n  }\n": typeof types.VotesResponceDocument,
    "\n  query votesHistory($eventID: ID!) {\n    analisticVotesHistory(eventID: $eventID) {\n      action\n      newIsLike\n      oldIsLike\n      reason\n      createdAt\n    }\n  }\n": typeof types.VotesHistoryDocument,
    "\n  mutation responceToOrganizatorEvent($id: ID!) {\n    respondToOrganizatorEvent(eventID: $id) {\n      id\n      status\n      type\n    }\n  }\n": typeof types.ResponceToOrganizatorEventDocument,
    "\n  query expertList(\n    $first: Int!\n    $after: Cursor\n    $filter: ExpertProfileWhereInput!\n  ) {\n    expertProfiles(first: $first, after: $after, where: $filter) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          peopleVotesCount\n          votesCount\n          countEvents\n          id\n          user {\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          about\n          region {\n            regionName\n          }\n          communityDirections {\n            direction\n            name\n          }\n        }\n      }\n    }\n  }\n": typeof types.ExpertListDocument,
    "\n  query MyProfile {\n    me {\n      avatar\n      firstName\n      lastName\n      expertProfile {\n        simpleSpeechLink\n        socialMediaLink\n        positiveVotes\n        negativeVotes\n        positivePeopleVotes\n        negativePeopleVotes\n        countEvents\n        peopleVotesCount\n        votesCount\n        region {\n          regionName\n        }\n        peopleRatingEnabled\n        about\n        communityDirections {\n          direction\n          name\n        }\n      }\n    }\n  }\n": typeof types.MyProfileDocument,
    "\n  mutation paymentEvent($data: CreatePaymentLinkEvent!) {\n    createPaidLinkEvent(data: $data)\n  }\n": typeof types.PaymentEventDocument,
    "\n  query myNotifications {\n    myNotifications(first: 150) {\n      edges {\n        node {\n          id\n          readAt\n          notification {\n            title\n            message\n            createdAt\n            level\n            expiresAt\n            actions {\n              label\n              type\n              payload\n              variant\n            }\n          }\n        }\n      }\n      totalCount\n    }\n  }\n": typeof types.MyNotificationsDocument,
    "\n  mutation acceptInviteOrganizatorEvent($requestID: ID!) {\n    acceptInviteOrganizatorEvent(requestID: $requestID)\n  }\n": typeof types.AcceptInviteOrganizatorEventDocument,
    "\n  mutation rejectInviteOrganizatorEvent($requestID: ID!) {\n    rejectInviteOrganizatorEvent(requestID: $requestID)\n  }\n": typeof types.RejectInviteOrganizatorEventDocument,
    "\n  mutation readNotifications($id: [ID!]) {\n    readNotification(id: $id)\n  }\n": typeof types.ReadNotificationsDocument,
    "\n  mutation readAllNotifications {\n    readAllNotifications\n  }\n": typeof types.ReadAllNotificationsDocument,
    "\n  mutation createOrganizatorRequest($data: ProfileCreateInput!) {\n    createProfileRequest(input: $data) {\n      id\n    }\n  }\n": typeof types.CreateOrganizatorRequestDocument,
    "\n  mutation createProfilePreExpert {\n    createProfileRequest(input: { changeType: create, type: pre_expert }) {\n      id\n    }\n  }\n": typeof types.CreateProfilePreExpertDocument,
    "\n  query representativeUsers($first: Int!, $after: Cursor) {\n    representativeExperts(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          id\n          firstName\n          lastName\n          avatar\n          nickname\n        }\n      }\n    }\n  }\n": typeof types.RepresentativeUsersDocument,
    "\n  query representiveEvents($expertID: ID!, $first: Int!, $after: Cursor) {\n    expertRepresentativeEvents(\n      expertID: $expertID\n      after: $after\n      first: $first\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          title\n          createdAt\n          myExpertVote\n          promoWorld\n          startTime\n          type\n          description\n          duration\n          endTime\n          eventRequest {\n            status\n            updatedAt\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasPreviousPage\n        hasNextPage\n        startCursor\n      }\n      totalCount\n    }\n  }\n": typeof types.RepresentiveEventsDocument,
    "\n  query userTariffLimits($userID: ID!) {\n    userTariffLimits(userID: $userID) {\n      votesPerEvent\n      eventsPerMonth\n      activeWordDurationHours\n    }\n  }\n": typeof types.UserTariffLimitsDocument,
    "\n  query preExpertExperts(\n    $first: Int!\n    $after: Cursor\n    $where: RepresentativeExpertRequestWhereInput\n    $orderBy: RepresentativeExpertRequestOrder\n  ) {\n    representativeExpertRequests(\n      first: $first\n      after: $after\n      where: $where\n      orderBy: $orderBy\n    ) {\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          status\n          targetUser {\n            id\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          representativeUser {\n            id\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          type\n          createdAt\n        }\n      }\n    }\n  }\n": typeof types.PreExpertExpertsDocument,
    "\n  mutation acceptRepresentive($id: ID!) {\n    acceptRepresentativeRequest(requestID: $id)\n  }\n": typeof types.AcceptRepresentiveDocument,
    "\n  mutation rejectRepresentive($id: ID!) {\n    rejectRepresentativeRequest(requestID: $id)\n  }\n": typeof types.RejectRepresentiveDocument,
    "\n  query tariffsList {\n    tariffs {\n      active\n      family\n      joinProfessionalCommunities\n      mailingPerMonth\n      numberExpertsManagedByOneRepresentative\n      organizerExpertsOnEvent\n      organizerFeeEventMailingPriceExpert\n      organizerInviteMailingPriceExpert\n      organizerPerEvent\n      organizerRequestExpertAboutPrice\n      paidEventResponsesPerMonth\n      paidRequestPublicationPrice\n      activeWordDurationHours\n      price\n      referralBonus\n      referralPrice\n      title\n      updatedAt\n      votesPerEvent\n      countExpertsInCreateCommunity\n      createProfessionalCommunities\n      createdAt\n      eventsPerMonth\n      freeEventResponses\n      id\n    }\n  }\n": typeof types.TariffsListDocument,
    "\n  mutation createPaymentLinkTariff($data: SubmitTariffInput!) {\n    submitTariff(data: $data) {\n      discount\n      openedByPromocode\n      paymentLink\n      promocodeResult\n    }\n  }\n": typeof types.CreatePaymentLinkTariffDocument,
    "\n  mutation createProfileVerification {\n    createVerifyExpertRequest {\n      id\n    }\n  }\n": typeof types.CreateProfileVerificationDocument,
    "\n  query verificationCardByID($id: ID!) {\n    verifyExpertRequest(id: $id) {\n      creator {\n        id\n        firstName\n        lastName\n        nickname\n        expertProfile {\n          about\n        }\n      }\n      status\n      createdAt\n    }\n  }\n": typeof types.VerificationCardByIdDocument,
    "\n  mutation verificationAccept(\n    $id: ID!\n    $isAccept: Boolean!\n    $isReject: Boolean!\n  ) {\n    voteVerifyExpert(\n      vote: {\n        verifyExpertRequestId: $id\n        isNegative: $isReject\n        isPositive: $isAccept\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.VerificationAcceptDocument,
};
const documents: Documents = {
    "\n  query myProfileRequest($argType: ProfileRequestType!) {\n    myProfileRequest(type: $argType) {\n      id\n      status\n      expertRequest {\n        newSimpleSpeechLink\n        newSocialMediaLink\n        newFirstName\n        newLastName\n        newAbout\n        newReferUsername\n        newRegion {\n          id\n        }\n        newCommunityDirections {\n          id\n        }\n      }\n      organizatorRequest {\n        newOrganizationName\n        newOrganizationURL\n      }\n    }\n  }\n": types.MyProfileRequestDocument,
    "\n  query eventsList(\n    $first: Int!\n    $after: Cursor\n    $filter: EventWhereInput\n    $orderBy: EventOrder\n  ) {\n    events(first: $first, after: $after, where: $filter, orderBy: $orderBy) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          id\n          title\n          type\n          startTime\n          endTime\n          duration\n          updatedAt\n          createdAt\n          description\n        }\n      }\n    }\n  }\n": types.EventsListDocument,
    "\n  query eventCardPage($id: ID!) {\n    event(id: $id) {\n      startTime\n      type\n      duration\n      createdAt\n      title\n      updatedAt\n      endTime\n      description\n      promoWorld\n      expertEvent {\n        link\n        commentToListener\n        promoWord\n      }\n      organizatorEvent {\n        feeType\n      }\n      myExpertVote\n      creator {\n        firstName\n        lastName\n        id\n        nickname\n        username\n        avatar\n        rights\n        expertProfile {\n          about\n          countEvents\n          votesCount\n          peopleVotesCount\n          region {\n            regionName\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n": types.EventCardPageDocument,
    "\n  query ProfileEvents(\n    $first: Int\n    $after: Cursor\n    $where: EventRequestWhereInput\n  ) {\n    myEventRequests(\n      first: $first\n      after: $after\n      orderBy: { direction: DESC, field: CREATED_AT }\n      where: $where\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        endCursor\n        startCursor\n      }\n      edges {\n        node {\n          id\n          createdAt\n          status\n          rejectComment\n          event {\n            id\n            title\n            duration\n            startTime\n            type\n            description\n            expertEvent {\n              promoWord\n            }\n            organizatorEvent {\n              feeType\n              place\n              speakerBenefits\n              targetAudience {\n                id\n              }\n              topic\n              transferPaid\n              verificationMode\n            }\n          }\n        }\n        cursor\n      }\n      totalCount\n    }\n  }\n": types.ProfileEventsDocument,
    "\n  query expertResponcesToOrganizaotorEvents(\n    $first: Int!\n    $after: Cursor\n    $where: ExpertResponseToEventWhereInput\n  ) {\n    expertResponseToEvents(first: $first, after: $after, where: $where) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          createdAt\n          id\n          status\n          type\n          user {\n            id\n            firstName\n            lastName\n            avatar\n            expertProfile {\n              about\n              region {\n                regionName\n              }\n            }\n          }\n          updatedAt\n        }\n      }\n    }\n  }\n": types.ExpertResponcesToOrganizaotorEventsDocument,
    "\n  mutation inviteExpertToOrganizatorEvent(\n    $data: CreateInviteToOrganizatorEvent!\n  ) {\n    createInviteToOrganizatorEvent(data: $data) {\n      id\n    }\n  }\n": types.InviteExpertToOrganizatorEventDocument,
    "\n  mutation acceptRespnceExpertToOrganizatorEvent(\n    $id: ID!\n    $data: CreateChildOrganizatorEventInput!\n  ) {\n    acceptResponOrganizatorEvent(responceID: $id, data: $data) {\n      id\n    }\n  }\n": types.AcceptRespnceExpertToOrganizatorEventDocument,
    "\n  mutation rejectRespnceExpertToOrganizatorEvent($id: ID!) {\n    rejectRespondOrganizatorEvent(responceID: $id) {\n      id\n    }\n  }\n": types.RejectRespnceExpertToOrganizatorEventDocument,
    "\n  mutation CreateExpertRequest($input: ProfileCreateInput!) {\n    createProfileRequest(input: $input) {\n      id\n    }\n  }\n": types.CreateExpertRequestDocument,
    "\n  query getExpertProfile($id: ID!) {\n    user(id: $id) {\n      avatar\n      firstName\n      lastName\n      rights\n      platforms {\n        platformID\n        platform\n      }\n      expertProfile {\n        socialMediaLink\n        peopleRatingEnabled\n        referUsername\n        region {\n          regionName\n        }\n        communityDirections {\n          direction\n          name\n        }\n        votesCount\n        peopleVotesCount\n        countEvents\n        about\n        myExpertVote\n        myPeopleVote\n      }\n    }\n  }\n": types.GetExpertProfileDocument,
    "\n  mutation assignTariff($data: AssignTariffInput!) {\n    assignTariff(data: $data)\n  }\n": types.AssignTariffDocument,
    "\n  mutation voteInPeopleRaiting($data: CreateVoteInput!) {\n    createVote(data: $data) {\n      id\n    }\n  }\n": types.VoteInPeopleRaitingDocument,
    "\n  mutation deletePeopleVote($data: DeleteVoteInput!) {\n    deleteVote(id: $data)\n  }\n": types.DeletePeopleVoteDocument,
    "\n  mutation verificateUserFromAdmin($userID: ID!) {\n    verifiesUser(userID: $userID)\n  }\n": types.VerificateUserFromAdminDocument,
    "\n  mutation preExpertRequestCreate(\n    $data: CreateRepresentativeExpertRequestInput!\n  ) {\n    createRepresentativeRequest(data: $data)\n  }\n": types.PreExpertRequestCreateDocument,
    "\n  mutation assignAdminRightToExpert($id: ID!) {\n    assignAdminRights(userID: $id) {\n      id\n    }\n  }\n": types.AssignAdminRightToExpertDocument,
    "\n  mutation deleteUserProfile {\n    deleteMyProfileUser\n  }\n": types.DeleteUserProfileDocument,
    "\n  mutation deleteMyExpertProfile {\n    deleteMyProfileExpert\n  }\n": types.DeleteMyExpertProfileDocument,
    "\n  mutation deleteMyOrganizaotorProfile {\n    deleteMyProfileOrganizator\n  }\n": types.DeleteMyOrganizaotorProfileDocument,
    "\n  query promocodesList($first: Int!, $after: Cursor) {\n    promocodes(first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          active\n          startAt\n          updatedAt\n          code\n          createdAt\n          maxCountActivations\n          maxMouthSubscriptionDuration\n          maxUserCountActivations\n          activatedCount\n          discount\n          endAt\n        }\n      }\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n": types.PromocodesListDocument,
    "\n  query settings {\n    settings {\n      notificationsFromExperts\n      peopleRatingEnabled\n    }\n  }\n": types.SettingsDocument,
    "\n  mutation setSettings($data: SettingsValuesInput!) {\n    setSettings(data: $data) {\n      notificationsFromExperts\n      peopleRatingEnabled\n    }\n  }\n": types.SetSettingsDocument,
    "\n  mutation updateTariff($id: ID!, $data: UpdateTariffInput!) {\n    updateTariff(id: $id, data: $data) {\n      id\n    }\n  }\n": types.UpdateTariffDocument,
    "\n  query tariffsControlList {\n    tariffs {\n      active\n      title\n      updatedAt\n      joinProfessionalCommunities\n      mailingPerMonth\n      numberExpertsManagedByOneRepresentative\n      organizerExpertsOnEvent\n      organizerFeeEventMailingPriceExpert\n      organizerInviteMailingPriceExpert\n      organizerPerEvent\n      organizerRequestExpertAboutPrice\n      paidEventResponsesPerMonth\n      paidRequestPublicationPrice\n      activeWordDurationHours\n      price\n      referralBonus\n      referralPrice\n      votesPerEvent\n      countExpertsInCreateCommunity\n      createProfessionalCommunities\n      eventsPerMonth\n      id\n    }\n  }\n": types.TariffsControlListDocument,
    "\n  query CommunityDirectionsCategorized {\n    communityDirectionsCategorized {\n      label\n      options {\n        id\n        name\n        direction\n      }\n    }\n  }\n": types.CommunityDirectionsCategorizedDocument,
    "\n  mutation deleteEventRequest($id: ID!) {\n    deleteEventRequest(requestID: $id)\n  }\n": types.DeleteEventRequestDocument,
    "\n  query regionsOptions {\n    regions {\n      regionName\n      id\n    }\n  }\n": types.RegionsOptionsDocument,
    "\n  query tariffListOptionsQiery {\n    tariffs {\n      id\n      title\n    }\n  }\n": types.TariffListOptionsQieryDocument,
    "\n  mutation createEventRequest($event: CreateEventRequestInput!) {\n    createEventRequest(event: $event) {\n      id\n      createdAt\n      status\n      event {\n        id\n        title\n        duration\n        description\n        startTime\n        expertEvent {\n          promoWord\n        }\n      }\n    }\n  }\n": types.CreateEventRequestDocument,
    "\n  query Me {\n    me {\n      id\n      firstName\n      lastName\n      rights\n      agreesTermsAt\n      notifications(where: { readAtIsNil: true }) {\n        totalCount\n      }\n    }\n  }\n": types.MeDocument,
    "\n  query myTariffLimits {\n    me {\n      id\n      tariffLimits {\n        votesPerEvent\n        eventsPerMonth\n        activeWordDurationHours\n      }\n    }\n  }\n": types.MyTariffLimitsDocument,
    "\n  query homePage {\n    statistic {\n      eventsCount\n      eventsHoursCount\n      usersCount\n      votesCount\n    }\n  }\n": types.HomePageDocument,
    "\n  query inputPromoWild($world: String! = \"\") {\n    inputEvent(promoWord: $world) {\n      id\n    }\n  }\n": types.InputPromoWildDocument,
    "\n  mutation AcceptPlatformRights($data: acceptPlatformRightsInput!) {\n    acceptPlatformRights(data: $data)\n  }\n": types.AcceptPlatformRightsDocument,
    "\n  query UsageRights {\n    platformRightsText\n  }\n": types.UsageRightsDocument,
    "\n  mutation mailingAdmin($data: CreateNotificationInput!) {\n    createNotification(data: $data)\n  }\n": types.MailingAdminDocument,
    "\n  query moderationCardEventRequest($id: ID!) {\n    eventRequest(id: $id) {\n      updatedAt\n      createdAt\n      verifiedAt\n      status\n      event {\n        startTime\n        duration\n        description\n        title\n        type\n        expertEvent {\n          commentToListener\n        }\n      }\n      creator {\n        id\n        firstName\n        lastName\n        nickname\n        avatar\n        expertProfile {\n          id\n          about\n          region {\n            regionName\n          }\n        }\n      }\n    }\n  }\n": types.ModerationCardEventRequestDocument,
    "\n  mutation AcceptEventRequest($id: ID!, $withPayment: Boolean = false) {\n    acceptEvent(eventId: $id, withPayment: $withPayment)\n  }\n": types.AcceptEventRequestDocument,
    "\n  mutation rejectEventRequest($id: ID!, $reason: String!) {\n    rejectEvent(eventId: $id, reason: $reason)\n  }\n": types.RejectEventRequestDocument,
    "\n  query moderationEventsList($first: Int!, $after: Cursor) {\n    eventRequests(\n      first: $first\n      after: $after\n      where: { status: pending }\n      orderBy: { field: CREATED_AT, direction: DESC }\n    ) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        node {\n          id\n          createdAt\n\n          status\n          event {\n            type\n            description\n            startTime\n            duration\n            title\n            expertEvent {\n              commentToListener\n              promoWord\n            }\n          }\n        }\n        cursor\n      }\n      totalCount\n    }\n  }\n": types.ModerationEventsListDocument,
    "\n  query profileRequest($id: ID!) {\n    ProfileRequest(id: $id) {\n      creator {\n        firstName\n        lastName\n        avatar\n      }\n      status\n      changeType\n      type\n      expertRequest {\n        newSocialMediaLink\n        newSimpleSpeechLink\n        newAbout\n        newFirstName\n        newLastName\n        newCommunityDirections {\n          direction\n          name\n        }\n        newReferUsername\n        newRegalia\n        newRegion {\n          regionName\n        }\n      }\n      organizatorRequest {\n        newOrganizationName\n        newOrganizationURL\n      }\n    }\n  }\n": types.ProfileRequestDocument,
    "\n  mutation AcceptExpertRequect($id: ID!) {\n    acceptProfileRequest(requestId: $id) {\n      id\n    }\n  }\n": types.AcceptExpertRequectDocument,
    "\n  mutation rejectProfileRequest($id: ID!, $reason: String!) {\n    rejectProfileRequest(requestId: $id, reason: $reason)\n  }\n": types.RejectProfileRequestDocument,
    "\n  query moderationProfilesList($first: Int!, $cursor: Cursor) {\n    profileRequests(\n      first: $first\n      after: $cursor\n      where: { status: pending }\n      orderBy: { direction: DESC, field: CREATED_AT }\n    ) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          type\n          createdAt\n          changeType\n          creator {\n            firstName\n            lastName\n            avatar\n          }\n        }\n      }\n      totalCount\n    }\n  }\n": types.ModerationProfilesListDocument,
    "\n  mutation createPromocode($data: CreatePromocodeInput!) {\n    createPromocode(data: $data) {\n      id\n      maxUserCountActivations\n      startAt\n      tariffs {\n        id\n        title\n      }\n      code\n      createdAt\n      discount\n      endAt\n      activatedCount\n      maxCountActivations\n      maxMouthSubscriptionDuration\n    }\n  }\n": types.CreatePromocodeDocument,
    "\n  mutation usageRightWrite($text: String!) {\n    platformRightsTextWrite(text: $text)\n  }\n": types.UsageRightWriteDocument,
    "\n  query searchExpert($query: String!) {\n    searchExpertToOrganizatorEvent(query: $query) {\n      id\n      firstName\n      lastName\n      avatar\n      nickname\n    }\n  }\n": types.SearchExpertDocument,
    "\n  mutation voteInEvent($data: CreateVoteInput!) {\n    createVote(data: $data) {\n      id\n    }\n  }\n": types.VoteInEventDocument,
    "\n  mutation deleteVoteInEvent($data: DeleteVoteInput!) {\n    deleteVote(id: $data)\n  }\n": types.DeleteVoteInEventDocument,
    "\n  query votesResponce($eventID: ID!) {\n    analisticVotes(eventID: $eventID) {\n      deletedAt\n      event {\n        promoWorld\n        startTime\n        endTime\n        title\n      }\n      targetExpert {\n        user {\n          id\n          firstName\n          lastName\n          nickname\n        }\n      }\n      user {\n        firstName\n        lastName\n        nickname\n        id\n      }\n      isLike\n    }\n  }\n": types.VotesResponceDocument,
    "\n  query votesHistory($eventID: ID!) {\n    analisticVotesHistory(eventID: $eventID) {\n      action\n      newIsLike\n      oldIsLike\n      reason\n      createdAt\n    }\n  }\n": types.VotesHistoryDocument,
    "\n  mutation responceToOrganizatorEvent($id: ID!) {\n    respondToOrganizatorEvent(eventID: $id) {\n      id\n      status\n      type\n    }\n  }\n": types.ResponceToOrganizatorEventDocument,
    "\n  query expertList(\n    $first: Int!\n    $after: Cursor\n    $filter: ExpertProfileWhereInput!\n  ) {\n    expertProfiles(first: $first, after: $after, where: $filter) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          peopleVotesCount\n          votesCount\n          countEvents\n          id\n          user {\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          about\n          region {\n            regionName\n          }\n          communityDirections {\n            direction\n            name\n          }\n        }\n      }\n    }\n  }\n": types.ExpertListDocument,
    "\n  query MyProfile {\n    me {\n      avatar\n      firstName\n      lastName\n      expertProfile {\n        simpleSpeechLink\n        socialMediaLink\n        positiveVotes\n        negativeVotes\n        positivePeopleVotes\n        negativePeopleVotes\n        countEvents\n        peopleVotesCount\n        votesCount\n        region {\n          regionName\n        }\n        peopleRatingEnabled\n        about\n        communityDirections {\n          direction\n          name\n        }\n      }\n    }\n  }\n": types.MyProfileDocument,
    "\n  mutation paymentEvent($data: CreatePaymentLinkEvent!) {\n    createPaidLinkEvent(data: $data)\n  }\n": types.PaymentEventDocument,
    "\n  query myNotifications {\n    myNotifications(first: 150) {\n      edges {\n        node {\n          id\n          readAt\n          notification {\n            title\n            message\n            createdAt\n            level\n            expiresAt\n            actions {\n              label\n              type\n              payload\n              variant\n            }\n          }\n        }\n      }\n      totalCount\n    }\n  }\n": types.MyNotificationsDocument,
    "\n  mutation acceptInviteOrganizatorEvent($requestID: ID!) {\n    acceptInviteOrganizatorEvent(requestID: $requestID)\n  }\n": types.AcceptInviteOrganizatorEventDocument,
    "\n  mutation rejectInviteOrganizatorEvent($requestID: ID!) {\n    rejectInviteOrganizatorEvent(requestID: $requestID)\n  }\n": types.RejectInviteOrganizatorEventDocument,
    "\n  mutation readNotifications($id: [ID!]) {\n    readNotification(id: $id)\n  }\n": types.ReadNotificationsDocument,
    "\n  mutation readAllNotifications {\n    readAllNotifications\n  }\n": types.ReadAllNotificationsDocument,
    "\n  mutation createOrganizatorRequest($data: ProfileCreateInput!) {\n    createProfileRequest(input: $data) {\n      id\n    }\n  }\n": types.CreateOrganizatorRequestDocument,
    "\n  mutation createProfilePreExpert {\n    createProfileRequest(input: { changeType: create, type: pre_expert }) {\n      id\n    }\n  }\n": types.CreateProfilePreExpertDocument,
    "\n  query representativeUsers($first: Int!, $after: Cursor) {\n    representativeExperts(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          id\n          firstName\n          lastName\n          avatar\n          nickname\n        }\n      }\n    }\n  }\n": types.RepresentativeUsersDocument,
    "\n  query representiveEvents($expertID: ID!, $first: Int!, $after: Cursor) {\n    expertRepresentativeEvents(\n      expertID: $expertID\n      after: $after\n      first: $first\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          title\n          createdAt\n          myExpertVote\n          promoWorld\n          startTime\n          type\n          description\n          duration\n          endTime\n          eventRequest {\n            status\n            updatedAt\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasPreviousPage\n        hasNextPage\n        startCursor\n      }\n      totalCount\n    }\n  }\n": types.RepresentiveEventsDocument,
    "\n  query userTariffLimits($userID: ID!) {\n    userTariffLimits(userID: $userID) {\n      votesPerEvent\n      eventsPerMonth\n      activeWordDurationHours\n    }\n  }\n": types.UserTariffLimitsDocument,
    "\n  query preExpertExperts(\n    $first: Int!\n    $after: Cursor\n    $where: RepresentativeExpertRequestWhereInput\n    $orderBy: RepresentativeExpertRequestOrder\n  ) {\n    representativeExpertRequests(\n      first: $first\n      after: $after\n      where: $where\n      orderBy: $orderBy\n    ) {\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          status\n          targetUser {\n            id\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          representativeUser {\n            id\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          type\n          createdAt\n        }\n      }\n    }\n  }\n": types.PreExpertExpertsDocument,
    "\n  mutation acceptRepresentive($id: ID!) {\n    acceptRepresentativeRequest(requestID: $id)\n  }\n": types.AcceptRepresentiveDocument,
    "\n  mutation rejectRepresentive($id: ID!) {\n    rejectRepresentativeRequest(requestID: $id)\n  }\n": types.RejectRepresentiveDocument,
    "\n  query tariffsList {\n    tariffs {\n      active\n      family\n      joinProfessionalCommunities\n      mailingPerMonth\n      numberExpertsManagedByOneRepresentative\n      organizerExpertsOnEvent\n      organizerFeeEventMailingPriceExpert\n      organizerInviteMailingPriceExpert\n      organizerPerEvent\n      organizerRequestExpertAboutPrice\n      paidEventResponsesPerMonth\n      paidRequestPublicationPrice\n      activeWordDurationHours\n      price\n      referralBonus\n      referralPrice\n      title\n      updatedAt\n      votesPerEvent\n      countExpertsInCreateCommunity\n      createProfessionalCommunities\n      createdAt\n      eventsPerMonth\n      freeEventResponses\n      id\n    }\n  }\n": types.TariffsListDocument,
    "\n  mutation createPaymentLinkTariff($data: SubmitTariffInput!) {\n    submitTariff(data: $data) {\n      discount\n      openedByPromocode\n      paymentLink\n      promocodeResult\n    }\n  }\n": types.CreatePaymentLinkTariffDocument,
    "\n  mutation createProfileVerification {\n    createVerifyExpertRequest {\n      id\n    }\n  }\n": types.CreateProfileVerificationDocument,
    "\n  query verificationCardByID($id: ID!) {\n    verifyExpertRequest(id: $id) {\n      creator {\n        id\n        firstName\n        lastName\n        nickname\n        expertProfile {\n          about\n        }\n      }\n      status\n      createdAt\n    }\n  }\n": types.VerificationCardByIdDocument,
    "\n  mutation verificationAccept(\n    $id: ID!\n    $isAccept: Boolean!\n    $isReject: Boolean!\n  ) {\n    voteVerifyExpert(\n      vote: {\n        verifyExpertRequestId: $id\n        isNegative: $isReject\n        isPositive: $isAccept\n      }\n    ) {\n      id\n    }\n  }\n": types.VerificationAcceptDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query myProfileRequest($argType: ProfileRequestType!) {\n    myProfileRequest(type: $argType) {\n      id\n      status\n      expertRequest {\n        newSimpleSpeechLink\n        newSocialMediaLink\n        newFirstName\n        newLastName\n        newAbout\n        newReferUsername\n        newRegion {\n          id\n        }\n        newCommunityDirections {\n          id\n        }\n      }\n      organizatorRequest {\n        newOrganizationName\n        newOrganizationURL\n      }\n    }\n  }\n"): typeof import('./graphql').MyProfileRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query eventsList(\n    $first: Int!\n    $after: Cursor\n    $filter: EventWhereInput\n    $orderBy: EventOrder\n  ) {\n    events(first: $first, after: $after, where: $filter, orderBy: $orderBy) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          id\n          title\n          type\n          startTime\n          endTime\n          duration\n          updatedAt\n          createdAt\n          description\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').EventsListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query eventCardPage($id: ID!) {\n    event(id: $id) {\n      startTime\n      type\n      duration\n      createdAt\n      title\n      updatedAt\n      endTime\n      description\n      promoWorld\n      expertEvent {\n        link\n        commentToListener\n        promoWord\n      }\n      organizatorEvent {\n        feeType\n      }\n      myExpertVote\n      creator {\n        firstName\n        lastName\n        id\n        nickname\n        username\n        avatar\n        rights\n        expertProfile {\n          about\n          countEvents\n          votesCount\n          peopleVotesCount\n          region {\n            regionName\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n"): typeof import('./graphql').EventCardPageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProfileEvents(\n    $first: Int\n    $after: Cursor\n    $where: EventRequestWhereInput\n  ) {\n    myEventRequests(\n      first: $first\n      after: $after\n      orderBy: { direction: DESC, field: CREATED_AT }\n      where: $where\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        endCursor\n        startCursor\n      }\n      edges {\n        node {\n          id\n          createdAt\n          status\n          rejectComment\n          event {\n            id\n            title\n            duration\n            startTime\n            type\n            description\n            expertEvent {\n              promoWord\n            }\n            organizatorEvent {\n              feeType\n              place\n              speakerBenefits\n              targetAudience {\n                id\n              }\n              topic\n              transferPaid\n              verificationMode\n            }\n          }\n        }\n        cursor\n      }\n      totalCount\n    }\n  }\n"): typeof import('./graphql').ProfileEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query expertResponcesToOrganizaotorEvents(\n    $first: Int!\n    $after: Cursor\n    $where: ExpertResponseToEventWhereInput\n  ) {\n    expertResponseToEvents(first: $first, after: $after, where: $where) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          createdAt\n          id\n          status\n          type\n          user {\n            id\n            firstName\n            lastName\n            avatar\n            expertProfile {\n              about\n              region {\n                regionName\n              }\n            }\n          }\n          updatedAt\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ExpertResponcesToOrganizaotorEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation inviteExpertToOrganizatorEvent(\n    $data: CreateInviteToOrganizatorEvent!\n  ) {\n    createInviteToOrganizatorEvent(data: $data) {\n      id\n    }\n  }\n"): typeof import('./graphql').InviteExpertToOrganizatorEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation acceptRespnceExpertToOrganizatorEvent(\n    $id: ID!\n    $data: CreateChildOrganizatorEventInput!\n  ) {\n    acceptResponOrganizatorEvent(responceID: $id, data: $data) {\n      id\n    }\n  }\n"): typeof import('./graphql').AcceptRespnceExpertToOrganizatorEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation rejectRespnceExpertToOrganizatorEvent($id: ID!) {\n    rejectRespondOrganizatorEvent(responceID: $id) {\n      id\n    }\n  }\n"): typeof import('./graphql').RejectRespnceExpertToOrganizatorEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateExpertRequest($input: ProfileCreateInput!) {\n    createProfileRequest(input: $input) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateExpertRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getExpertProfile($id: ID!) {\n    user(id: $id) {\n      avatar\n      firstName\n      lastName\n      rights\n      platforms {\n        platformID\n        platform\n      }\n      expertProfile {\n        socialMediaLink\n        peopleRatingEnabled\n        referUsername\n        region {\n          regionName\n        }\n        communityDirections {\n          direction\n          name\n        }\n        votesCount\n        peopleVotesCount\n        countEvents\n        about\n        myExpertVote\n        myPeopleVote\n      }\n    }\n  }\n"): typeof import('./graphql').GetExpertProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation assignTariff($data: AssignTariffInput!) {\n    assignTariff(data: $data)\n  }\n"): typeof import('./graphql').AssignTariffDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation voteInPeopleRaiting($data: CreateVoteInput!) {\n    createVote(data: $data) {\n      id\n    }\n  }\n"): typeof import('./graphql').VoteInPeopleRaitingDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deletePeopleVote($data: DeleteVoteInput!) {\n    deleteVote(id: $data)\n  }\n"): typeof import('./graphql').DeletePeopleVoteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation verificateUserFromAdmin($userID: ID!) {\n    verifiesUser(userID: $userID)\n  }\n"): typeof import('./graphql').VerificateUserFromAdminDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation preExpertRequestCreate(\n    $data: CreateRepresentativeExpertRequestInput!\n  ) {\n    createRepresentativeRequest(data: $data)\n  }\n"): typeof import('./graphql').PreExpertRequestCreateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation assignAdminRightToExpert($id: ID!) {\n    assignAdminRights(userID: $id) {\n      id\n    }\n  }\n"): typeof import('./graphql').AssignAdminRightToExpertDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteUserProfile {\n    deleteMyProfileUser\n  }\n"): typeof import('./graphql').DeleteUserProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteMyExpertProfile {\n    deleteMyProfileExpert\n  }\n"): typeof import('./graphql').DeleteMyExpertProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteMyOrganizaotorProfile {\n    deleteMyProfileOrganizator\n  }\n"): typeof import('./graphql').DeleteMyOrganizaotorProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query promocodesList($first: Int!, $after: Cursor) {\n    promocodes(first: $first, after: $after) {\n      edges {\n        cursor\n        node {\n          id\n          active\n          startAt\n          updatedAt\n          code\n          createdAt\n          maxCountActivations\n          maxMouthSubscriptionDuration\n          maxUserCountActivations\n          activatedCount\n          discount\n          endAt\n        }\n      }\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n"): typeof import('./graphql').PromocodesListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query settings {\n    settings {\n      notificationsFromExperts\n      peopleRatingEnabled\n    }\n  }\n"): typeof import('./graphql').SettingsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setSettings($data: SettingsValuesInput!) {\n    setSettings(data: $data) {\n      notificationsFromExperts\n      peopleRatingEnabled\n    }\n  }\n"): typeof import('./graphql').SetSettingsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateTariff($id: ID!, $data: UpdateTariffInput!) {\n    updateTariff(id: $id, data: $data) {\n      id\n    }\n  }\n"): typeof import('./graphql').UpdateTariffDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query tariffsControlList {\n    tariffs {\n      active\n      title\n      updatedAt\n      joinProfessionalCommunities\n      mailingPerMonth\n      numberExpertsManagedByOneRepresentative\n      organizerExpertsOnEvent\n      organizerFeeEventMailingPriceExpert\n      organizerInviteMailingPriceExpert\n      organizerPerEvent\n      organizerRequestExpertAboutPrice\n      paidEventResponsesPerMonth\n      paidRequestPublicationPrice\n      activeWordDurationHours\n      price\n      referralBonus\n      referralPrice\n      votesPerEvent\n      countExpertsInCreateCommunity\n      createProfessionalCommunities\n      eventsPerMonth\n      id\n    }\n  }\n"): typeof import('./graphql').TariffsControlListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CommunityDirectionsCategorized {\n    communityDirectionsCategorized {\n      label\n      options {\n        id\n        name\n        direction\n      }\n    }\n  }\n"): typeof import('./graphql').CommunityDirectionsCategorizedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteEventRequest($id: ID!) {\n    deleteEventRequest(requestID: $id)\n  }\n"): typeof import('./graphql').DeleteEventRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query regionsOptions {\n    regions {\n      regionName\n      id\n    }\n  }\n"): typeof import('./graphql').RegionsOptionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query tariffListOptionsQiery {\n    tariffs {\n      id\n      title\n    }\n  }\n"): typeof import('./graphql').TariffListOptionsQieryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createEventRequest($event: CreateEventRequestInput!) {\n    createEventRequest(event: $event) {\n      id\n      createdAt\n      status\n      event {\n        id\n        title\n        duration\n        description\n        startTime\n        expertEvent {\n          promoWord\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').CreateEventRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      firstName\n      lastName\n      rights\n      agreesTermsAt\n      notifications(where: { readAtIsNil: true }) {\n        totalCount\n      }\n    }\n  }\n"): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query myTariffLimits {\n    me {\n      id\n      tariffLimits {\n        votesPerEvent\n        eventsPerMonth\n        activeWordDurationHours\n      }\n    }\n  }\n"): typeof import('./graphql').MyTariffLimitsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query homePage {\n    statistic {\n      eventsCount\n      eventsHoursCount\n      usersCount\n      votesCount\n    }\n  }\n"): typeof import('./graphql').HomePageDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query inputPromoWild($world: String! = \"\") {\n    inputEvent(promoWord: $world) {\n      id\n    }\n  }\n"): typeof import('./graphql').InputPromoWildDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptPlatformRights($data: acceptPlatformRightsInput!) {\n    acceptPlatformRights(data: $data)\n  }\n"): typeof import('./graphql').AcceptPlatformRightsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsageRights {\n    platformRightsText\n  }\n"): typeof import('./graphql').UsageRightsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation mailingAdmin($data: CreateNotificationInput!) {\n    createNotification(data: $data)\n  }\n"): typeof import('./graphql').MailingAdminDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query moderationCardEventRequest($id: ID!) {\n    eventRequest(id: $id) {\n      updatedAt\n      createdAt\n      verifiedAt\n      status\n      event {\n        startTime\n        duration\n        description\n        title\n        type\n        expertEvent {\n          commentToListener\n        }\n      }\n      creator {\n        id\n        firstName\n        lastName\n        nickname\n        avatar\n        expertProfile {\n          id\n          about\n          region {\n            regionName\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ModerationCardEventRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptEventRequest($id: ID!, $withPayment: Boolean = false) {\n    acceptEvent(eventId: $id, withPayment: $withPayment)\n  }\n"): typeof import('./graphql').AcceptEventRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation rejectEventRequest($id: ID!, $reason: String!) {\n    rejectEvent(eventId: $id, reason: $reason)\n  }\n"): typeof import('./graphql').RejectEventRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query moderationEventsList($first: Int!, $after: Cursor) {\n    eventRequests(\n      first: $first\n      after: $after\n      where: { status: pending }\n      orderBy: { field: CREATED_AT, direction: DESC }\n    ) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        node {\n          id\n          createdAt\n\n          status\n          event {\n            type\n            description\n            startTime\n            duration\n            title\n            expertEvent {\n              commentToListener\n              promoWord\n            }\n          }\n        }\n        cursor\n      }\n      totalCount\n    }\n  }\n"): typeof import('./graphql').ModerationEventsListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query profileRequest($id: ID!) {\n    ProfileRequest(id: $id) {\n      creator {\n        firstName\n        lastName\n        avatar\n      }\n      status\n      changeType\n      type\n      expertRequest {\n        newSocialMediaLink\n        newSimpleSpeechLink\n        newAbout\n        newFirstName\n        newLastName\n        newCommunityDirections {\n          direction\n          name\n        }\n        newReferUsername\n        newRegalia\n        newRegion {\n          regionName\n        }\n      }\n      organizatorRequest {\n        newOrganizationName\n        newOrganizationURL\n      }\n    }\n  }\n"): typeof import('./graphql').ProfileRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptExpertRequect($id: ID!) {\n    acceptProfileRequest(requestId: $id) {\n      id\n    }\n  }\n"): typeof import('./graphql').AcceptExpertRequectDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation rejectProfileRequest($id: ID!, $reason: String!) {\n    rejectProfileRequest(requestId: $id, reason: $reason)\n  }\n"): typeof import('./graphql').RejectProfileRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query moderationProfilesList($first: Int!, $cursor: Cursor) {\n    profileRequests(\n      first: $first\n      after: $cursor\n      where: { status: pending }\n      orderBy: { direction: DESC, field: CREATED_AT }\n    ) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          type\n          createdAt\n          changeType\n          creator {\n            firstName\n            lastName\n            avatar\n          }\n        }\n      }\n      totalCount\n    }\n  }\n"): typeof import('./graphql').ModerationProfilesListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createPromocode($data: CreatePromocodeInput!) {\n    createPromocode(data: $data) {\n      id\n      maxUserCountActivations\n      startAt\n      tariffs {\n        id\n        title\n      }\n      code\n      createdAt\n      discount\n      endAt\n      activatedCount\n      maxCountActivations\n      maxMouthSubscriptionDuration\n    }\n  }\n"): typeof import('./graphql').CreatePromocodeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation usageRightWrite($text: String!) {\n    platformRightsTextWrite(text: $text)\n  }\n"): typeof import('./graphql').UsageRightWriteDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchExpert($query: String!) {\n    searchExpertToOrganizatorEvent(query: $query) {\n      id\n      firstName\n      lastName\n      avatar\n      nickname\n    }\n  }\n"): typeof import('./graphql').SearchExpertDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation voteInEvent($data: CreateVoteInput!) {\n    createVote(data: $data) {\n      id\n    }\n  }\n"): typeof import('./graphql').VoteInEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteVoteInEvent($data: DeleteVoteInput!) {\n    deleteVote(id: $data)\n  }\n"): typeof import('./graphql').DeleteVoteInEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query votesResponce($eventID: ID!) {\n    analisticVotes(eventID: $eventID) {\n      deletedAt\n      event {\n        promoWorld\n        startTime\n        endTime\n        title\n      }\n      targetExpert {\n        user {\n          id\n          firstName\n          lastName\n          nickname\n        }\n      }\n      user {\n        firstName\n        lastName\n        nickname\n        id\n      }\n      isLike\n    }\n  }\n"): typeof import('./graphql').VotesResponceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query votesHistory($eventID: ID!) {\n    analisticVotesHistory(eventID: $eventID) {\n      action\n      newIsLike\n      oldIsLike\n      reason\n      createdAt\n    }\n  }\n"): typeof import('./graphql').VotesHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation responceToOrganizatorEvent($id: ID!) {\n    respondToOrganizatorEvent(eventID: $id) {\n      id\n      status\n      type\n    }\n  }\n"): typeof import('./graphql').ResponceToOrganizatorEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query expertList(\n    $first: Int!\n    $after: Cursor\n    $filter: ExpertProfileWhereInput!\n  ) {\n    expertProfiles(first: $first, after: $after, where: $filter) {\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          peopleVotesCount\n          votesCount\n          countEvents\n          id\n          user {\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          about\n          region {\n            regionName\n          }\n          communityDirections {\n            direction\n            name\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').ExpertListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyProfile {\n    me {\n      avatar\n      firstName\n      lastName\n      expertProfile {\n        simpleSpeechLink\n        socialMediaLink\n        positiveVotes\n        negativeVotes\n        positivePeopleVotes\n        negativePeopleVotes\n        countEvents\n        peopleVotesCount\n        votesCount\n        region {\n          regionName\n        }\n        peopleRatingEnabled\n        about\n        communityDirections {\n          direction\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').MyProfileDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation paymentEvent($data: CreatePaymentLinkEvent!) {\n    createPaidLinkEvent(data: $data)\n  }\n"): typeof import('./graphql').PaymentEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query myNotifications {\n    myNotifications(first: 150) {\n      edges {\n        node {\n          id\n          readAt\n          notification {\n            title\n            message\n            createdAt\n            level\n            expiresAt\n            actions {\n              label\n              type\n              payload\n              variant\n            }\n          }\n        }\n      }\n      totalCount\n    }\n  }\n"): typeof import('./graphql').MyNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation acceptInviteOrganizatorEvent($requestID: ID!) {\n    acceptInviteOrganizatorEvent(requestID: $requestID)\n  }\n"): typeof import('./graphql').AcceptInviteOrganizatorEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation rejectInviteOrganizatorEvent($requestID: ID!) {\n    rejectInviteOrganizatorEvent(requestID: $requestID)\n  }\n"): typeof import('./graphql').RejectInviteOrganizatorEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation readNotifications($id: [ID!]) {\n    readNotification(id: $id)\n  }\n"): typeof import('./graphql').ReadNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation readAllNotifications {\n    readAllNotifications\n  }\n"): typeof import('./graphql').ReadAllNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createOrganizatorRequest($data: ProfileCreateInput!) {\n    createProfileRequest(input: $data) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateOrganizatorRequestDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createProfilePreExpert {\n    createProfileRequest(input: { changeType: create, type: pre_expert }) {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateProfilePreExpertDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query representativeUsers($first: Int!, $after: Cursor) {\n    representativeExperts(first: $first, after: $after) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      totalCount\n      edges {\n        cursor\n        node {\n          id\n          firstName\n          lastName\n          avatar\n          nickname\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').RepresentativeUsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query representiveEvents($expertID: ID!, $first: Int!, $after: Cursor) {\n    expertRepresentativeEvents(\n      expertID: $expertID\n      after: $after\n      first: $first\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          title\n          createdAt\n          myExpertVote\n          promoWorld\n          startTime\n          type\n          description\n          duration\n          endTime\n          eventRequest {\n            status\n            updatedAt\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasPreviousPage\n        hasNextPage\n        startCursor\n      }\n      totalCount\n    }\n  }\n"): typeof import('./graphql').RepresentiveEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query userTariffLimits($userID: ID!) {\n    userTariffLimits(userID: $userID) {\n      votesPerEvent\n      eventsPerMonth\n      activeWordDurationHours\n    }\n  }\n"): typeof import('./graphql').UserTariffLimitsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query preExpertExperts(\n    $first: Int!\n    $after: Cursor\n    $where: RepresentativeExpertRequestWhereInput\n    $orderBy: RepresentativeExpertRequestOrder\n  ) {\n    representativeExpertRequests(\n      first: $first\n      after: $after\n      where: $where\n      orderBy: $orderBy\n    ) {\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          status\n          targetUser {\n            id\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          representativeUser {\n            id\n            firstName\n            lastName\n            avatar\n            rights\n          }\n          type\n          createdAt\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').PreExpertExpertsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation acceptRepresentive($id: ID!) {\n    acceptRepresentativeRequest(requestID: $id)\n  }\n"): typeof import('./graphql').AcceptRepresentiveDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation rejectRepresentive($id: ID!) {\n    rejectRepresentativeRequest(requestID: $id)\n  }\n"): typeof import('./graphql').RejectRepresentiveDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query tariffsList {\n    tariffs {\n      active\n      family\n      joinProfessionalCommunities\n      mailingPerMonth\n      numberExpertsManagedByOneRepresentative\n      organizerExpertsOnEvent\n      organizerFeeEventMailingPriceExpert\n      organizerInviteMailingPriceExpert\n      organizerPerEvent\n      organizerRequestExpertAboutPrice\n      paidEventResponsesPerMonth\n      paidRequestPublicationPrice\n      activeWordDurationHours\n      price\n      referralBonus\n      referralPrice\n      title\n      updatedAt\n      votesPerEvent\n      countExpertsInCreateCommunity\n      createProfessionalCommunities\n      createdAt\n      eventsPerMonth\n      freeEventResponses\n      id\n    }\n  }\n"): typeof import('./graphql').TariffsListDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createPaymentLinkTariff($data: SubmitTariffInput!) {\n    submitTariff(data: $data) {\n      discount\n      openedByPromocode\n      paymentLink\n      promocodeResult\n    }\n  }\n"): typeof import('./graphql').CreatePaymentLinkTariffDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createProfileVerification {\n    createVerifyExpertRequest {\n      id\n    }\n  }\n"): typeof import('./graphql').CreateProfileVerificationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query verificationCardByID($id: ID!) {\n    verifyExpertRequest(id: $id) {\n      creator {\n        id\n        firstName\n        lastName\n        nickname\n        expertProfile {\n          about\n        }\n      }\n      status\n      createdAt\n    }\n  }\n"): typeof import('./graphql').VerificationCardByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation verificationAccept(\n    $id: ID!\n    $isAccept: Boolean!\n    $isReject: Boolean!\n  ) {\n    voteVerifyExpert(\n      vote: {\n        verifyExpertRequestId: $id\n        isNegative: $isReject\n        isPositive: $isAccept\n      }\n    ) {\n      id\n    }\n  }\n"): typeof import('./graphql').VerificationAcceptDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
