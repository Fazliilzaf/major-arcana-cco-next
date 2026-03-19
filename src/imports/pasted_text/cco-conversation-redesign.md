Design objective:
Redesign this conversation booking view to make it more compact, clearer, and more efficient for daily customer communication work in a CCO context. The goal is not just to restyle the screen, but to solve the workflow problems in a smart, user-friendly, and operationally efficient way.

Core problems to solve

1) Booking summary card is too tall

The blue booking card at the top currently uses too much vertical space. It should be redesigned into a single-line compact summary row.

Desired behavior:
	•	Show the key information on one line, for example:
PRP-behandling · Bekräftad bokning för fredag 09:00
	•	Keep the row compact in height.
	•	The right side should be used for an expand/collapse interaction so the user can open more details when needed.
	•	Remove the small blue AI avatar/button on the far right if it does not add essential value.

Design goal:
Make the booking status immediately scannable without pushing the conversation down.
2) Reply area at the bottom wastes too much space

The bottom reply/composer area currently gives too much space to the icons and the send button, and too little space to the actual writing area.

Desired direction:
	•	Increase the usable width/space of the text area so the user gets a better writing and reading view.
	•	Reduce the visual dominance of the send button.
	•	Compress the send button vertically to roughly the same height as the smaller action buttons.
	•	Move the send button below the reply field, rather than having it take up space beside it.
	•	Reconsider the layout of the right-side action icons so they do not shrink the message composition area.

Design goal:
Prioritize the writing surface over secondary controls.
3) Replace the always-visible reply studio with an on-demand interaction

Instead of showing a persistent reply studio/input block at the bottom, redesign this so the user interacts with a Svarsstudio button that opens the reply workspace only when needed.

Desired behavior:
	•	The bottom area should be lighter and less cluttered by default.
	•	The user taps Svarsstudio, and a panel/modal/drawer/sheet opens.
	•	That opened workspace can contain smart reply tools and advanced actions.

Design goal:
Reduce visual clutter and make advanced functionality available on demand, instead of permanently occupying space.
4) Add smart follow-up and memory-support features

Inside the reply studio / smart action layer, include functionality that helps the user manage follow-up rather than only write a reply.

Examples of useful smart functions:
	•	Reply later / snooze this customer
	•	Remind me if this customer has not been answered
	•	Flag as “needs follow-up”
	•	Suggest a reminder time
	•	Surface forgotten conversations
	•	Track unanswered conversations
	•	Quickly return to customers marked for follow-up

These features should feel operational and practical, not gimmicky.

Design goal:
Help the user remember, prioritize, and return to customer conversations without cognitive overload.
5) Give easy access to follow-up and unanswered views from the landing/start view

Somewhere in the landing view/home overview, there should be a simple and fast way to access:
	•	customers to return to
	•	conversations not yet answered
	•	pending follow-ups
	•	forgotten/unhandled conversations

Do not over-prescribe the exact placement. Propose the best information architecture and UI pattern for this.

Design goal:
Support overview and recovery of missed work.
What we want from design

We do not want a literal implementation of our wording.
We want you to understand the workflow problem and propose the best optimized solution for this use case.

Please focus on:
	•	reducing vertical clutter
	•	increasing message-writing usability
	•	making secondary tools contextual/on-demand
	•	improving clarity and scanability
	•	supporting follow-up workflows in a simple way
	•	designing for operational efficiency in a CCO environment

Deliverables to explore

Please propose:
	1.	A redesigned conversation screen
	2.	A compact booking summary pattern
	3.	A new bottom action/composer pattern
	4.	A concept for Svarsstudio as an on-demand layer
	5.	A lightweight overview pattern for unanswered/follow-up conversations

Important constraint

Do not just make the UI cleaner visually.
Solve the underlying workflow problem:
	•	too much permanent UI
	•	too little writing space
	•	weak support for follow-up and forgotten conversations
	•	inefficient prioritization of what matters most on the screen 1) Expanded booking card should use width better

When the booking card for “PRP-behandling” is expanded, the current design stacks content downward too much. It becomes tall instead of information-dense.

What we want instead

The expanded state should still be compact and should use horizontal grouping to reduce height.

Examples of how to think:
	•	Group related metadata on the same row where possible
	•	Use 2-column or responsive inline layouts instead of single long vertical stacks
	•	Keep key info visible without requiring much scrolling
	•	Reduce unnecessary spacing between text blocks, status chips, metadata and actions

Key information that should stay highly visible
	•	treatment / case type
	•	booking status
	•	booked time
	•	price
	•	latest activity / timestamp
	•	message count
	•	special requests
	•	next best action

The expanded state should feel like a compact control panel, not a long content block.
2) Bring back the smart functions

An important issue in the current direction is that the expanded booking card seems to have lost the smart operational actions that existed earlier.

We want the smart functions to come back, and design should also evaluate whether any important smart actions are missing.

Smart functions should feel embedded in the workflow

Not decorative, not hidden, and not secondary if they are key to execution.

Examples of relevant smart actions:
	•	confirm booking
	•	suggest next step
	•	reply later / snooze
	•	remind me if no reply is sent
	•	mark for follow-up
	•	return to customer later
	•	highlight unanswered conversations
	•	detect forgotten conversations
	•	generate suggested responses
	•	summarize the thread / key context
	•	propose best next action
	•	quick access to customer history or recent activity

Design may improve or expand this set if there are better workflow-supporting ideas. 3) Compactness should be a system-wide principle

This is not only about the PRP card.
We want this principle applied more broadly across the UI:

Prefer:
	•	tighter vertical spacing
	•	more intelligent horizontal layout
	•	stronger grouping of related information
	•	less dead space
	•	faster scanning
	•	more utility per module

Avoid:
	•	tall cards with too much padding
	•	single-column stacking when width is available
	•	actions pushed far apart
	•	layouts that look clean visually but reduce work efficiency

The interface should feel professional and operationally sharp, not oversized.
3) Compactness should be a system-wide principle

This is not only about the PRP card.
We want this principle applied more broadly across the UI:

Prefer:
	•	tighter vertical spacing
	•	more intelligent horizontal layout
	•	stronger grouping of related information
	•	less dead space
	•	faster scanning
	•	more utility per module

Avoid:
	•	tall cards with too much padding
	•	single-column stacking when width is available
	•	actions pushed far apart
	•	layouts that look clean visually but reduce work efficiency

The interface should feel professional and operationally sharp, not oversized.
5) We want Figma Design to solve the problem, not just follow instructions literally

We are not asking for a pixel-exact implementation of our words.
We want the design team to solve the underlying UX problem in the best possible way.

The real problem to solve is:
	•	too much vertical stacking
	•	too little use of available width
	•	smart functions have been weakened or removed
	•	cards feel larger without becoming more useful
	•	workflow support is not strong enough

The expected outcome:

A more compact, intelligent and high-utility interface that supports real customer handling work efficiently.
Vi vill inte ha ett luftigare UI om det gör arbetsflödet sämre. Den nuvarande riktningen staplar innehåll på höjden, använder bredden för dåligt och har tappat smarta funktioner. Vi vill att kort och moduler – särskilt PRP-behandlingskortet – designas tätare, smartare och mer horisontellt: mindre dödyta, mer relevant information per yta, tydligare överblick och snabbare väg till nästa åtgärd. Smarta funktioner ska tillbaka och gärna förbättras. Målet är inte bara ett renare gränssnitt, utan ett kompakt, högfunktionellt arbetsverktyg som fungerar optimalt för CCO.