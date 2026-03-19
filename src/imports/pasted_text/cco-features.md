F. CCO – helhetsfunktioner på sidan


F1. Data‑ingest och förståelse av “har jag svarat?”

	76. CCO ska läsa mail via Microsoft 365 / Exchange Online (Graph).
	77. CCO ska kunna köras på vald mailbox‑allowlist (inte “läcka” andra).
	78. CCO ska kunna köras i full‑tenant mode om ni vill (men med caps + budget).
	79. CCO ska ha kill switch: Graph Read ON/OFF.
	80. CCO ska ha separat kill switch: Graph Send ON/OFF.
	81. CCO ska läsa både Inbox och Sent (för att se svar du skickat i Outlook).
	82. “True unanswered” = senaste riktning inbound utan ny outbound.
	83. Om du svarar via Outlook (mobil/Mac/webb) ska Arcana upptäcka det nästa run (förutsätter Sent‑read i samma tidsfönster).
	84. CCO ska logga audit: mailbox.read.start/complete/error per run.
	85. Pagination måste loopa @odata.nextLink med loop‑guard + page‑limit.
	86. Retry/backoff måste hantera 429/5xx/timeout.
	87. Timeout måste finnas per mailbox och per run.
	88. Error budget i full‑tenant: ett mailbox‑fel får inte krascha hela run (inom budget).
	89. Idempotency på send måste förhindra dubbelsend.
	90. Send får bara ske vid beslut allow/allow_flag (fail‑closed annars).


F2. Triage‑modellen (det du ser i inboxen)

	91. CCO ska alltid koka ner många mail till tydliga beslut.
	92. CCO ska visa dominantRisk (en huvudsignal) per tråd.
	93. CCO ska visa recommendedAction (en konkret rad: vad du ska göra).
	94. CCO ska visa intent + tone + priorityLevel + confidence.
	95. CCO ska visa SLA‑status (safe/warning/breach) och återstående tid.
	96. CCO ska ha lifecycle‑status (ex. new/active/returning/dormant) om ni använder det.
	97. CCO ska visa “Nya sedan sist” (lastSeen) för att minska scanning.
	98. CCO ska ha Sprint‑läge: max 3 aktiva beslut.
	99. CCO ska ha “Soft Break” om du klickar utanför sprint när sprint är aktiv.
	100. CCO ska ha “Selected thread stability”: vald tråd ska inte försvinna pga collapse/filter utan tydlig hantering.


F3. Drafting – avlastar skrivandet (men du äger dialogen)

	101. CCO ska generera 3 draft modes: kort / varm / professionell.
	102. CCO ska välja recommendedMode, men aldrig overridea ditt val.
	103. Drafting ska vara context‑aware: intent + tone + priority + tenant tone style.
	104. Drafting ska följa hårda begränsningar (t.ex. max ord/stycken).
	105. Drafting ska undvika förbjudna kategorier (policy floor).
	106. Alla drafts ska gå genom outputRisk + policyFloor.
	107. UI ska låta dig toggla mode och se rekommendation tydligt.
	108. UI ska ge knappar för: förkorta, varmare, mer professionell, skarpare.
	109. UI ska ha tydlig “Kopiera svar” och “Markera hanterad”.
	110. UI ska ha “Återkom senare” (påminnelse) som flyttar tråd till uppföljningsläge.


F4. Writing Identity (rätt ton per avsändaradress)

	111. CCO ska kunna ha writing profiles per mailbox (info@ vs bokning@ vs person).
	112. Profile lookup ska använda mailboxAddress/UPN, aldrig GUID‑fallback utan validering.
	113. Writing identity ska kunna auto‑extraheras från historik (minst v1).
	114. Writing identity ska kunna manuellt justeras i UI (admin override).
	115. Writing identity får påverka draft och ev. confidence‑viktning (inte policy/risk).
	116. All uppdatering av writing profile ska audit‑loggas (writing.profile.updated).
	117. Writing profile ska versionsbumpas vid ändring.


F5. SLA, öppettider och “stress‑avlastning”

	118. SLA ska ta hänsyn till öppettider (mån‑fre 08–20, lör 08–18, sön stängt).
	119. SLA ska visa hoursRemaining och status med begriplig text.
	120. SLA breach ska prioriteras före allt annat i triage.
	121. SLA warning ska vara tydlig men inte skrikig (pastell + text).
	122. Stagnation ska upptäckas (ingen rörelse på X timmar) och föreslå follow‑up.
	123. “FollowUpSuggested” ska vara en tydlig recommendedAction, inte bara chip.


F6. Relation och “hur varm kunden är”

	124. CCO ska visa en enkel “temperature/warmth”‑signal (0..1 eller låg/medel/hög).
	125. CCO ska koppla warmth till strategi: mjuk uppföljning vs aktivt chase.
	126. CCO ska kunna föreslå 2–3 uppföljningspunkter (t.ex. 24h, 72h, 7d) med manual approve.
	127. Du ska kunna stänga av uppföljningsautomation per kund/tråd (manual override).
	128. Systemet ska tydligt markera “kunden återkom efter 1 vecka” som återaktivering (returning).


F7. Skalning: 200+ mail (lugnt UX)

	129. Inboxen ska ha Progressive Disclosure: Sprint → High/Critical → Needs Reply Today → Rest.
	130. “Rest” ska vara kollapsad by default med CTA “Visa X till”.
	131. Density modes: Fokus / Arbete / Översikt (default Arbete).
	132. Aging fade: låg prio + gammalt tonas ned subtilt (ingen blur/animation).
	133. Dominant risk accent styr raden (sekundär risk diskret).
	134. Performance guardrails: lazy/virtual render, stabil scroll.
	135. Section headers visar count + risk + CTA.
	136. Auto‑reorder: om High/Critical är tom → Needs Reply Today blir sektion 2.
	137. Psychology rule: vid 200+ mail → max 15 synliga rader samtidigt.
	138. No Cognitive Overflow: max 3 sprint, 7 high/critical, 12 needs reply (resten bakom expand).
	139. Overflow indicator: “7 av 11 visas” osv, aldrig auto‑expand.
	140. Density mode är endast visningslager: får aldrig ändra prioriteringslogik/sortering/urval.


F8. Språk och UI‑polish (superviktigt för förtroende)

	141. All text i CCO ska vara svenska som standard.
	142. Engelska ska vara ett val (språk‑toggle), inte random strings.
	143. Inga “Sprint / High / Needs Reply / Risk / Policy” ska ligga kvar i UI.
	144. Pastellpalett ska vara konsekvent (mjuk, inte neon).
	145. Mer kontrast via skuggning och block, inte via aggressiva färger.
	146. Större block i Reply Studio: gruppera fält så att du ser “vad är vad” direkt.
	147. Logga/signatur ska inte “ta över” visuellt i editorn — den ska vara underordnad.
	148. “Rekommenderad åtgärd” ska vara klickbar och tooltip‑förklarad.
	149. SLA‑komponenter ska ha tydlig legend (vad betyder breach/warning/safe).
	150. UI ska ha tydlig sök‑ruta (namn, mail, nyckelord i historik).
	151. UI ska ha mailbox‑väljare: “vilken adress jobbar jag från?”
	152. UI ska kunna visa “alla mail per mailbox” i en separat vy/sektion utan att bryta workflow.


F9. Skräpmail och lågprioriterade typer

	153. CCO ska kunna känna igen “lågvärdigt” mail (orderbekräftelser, marketing, no‑reply).
	154. Dessa ska inte hamna i Sprint/High/Needs Reply (läggs i “Lågprioritet / Ignorera”).
	155. Du ska kunna manuellt markera en tråd som “ignorera typ framöver”.
	156. Det ska finnas en tydlig “Ångra/Restore” för misstag (i alla fall i början).


F10. “Radera mail” – din nya knapp (säker version)

	157. “Radera” ska i v1 betyda Flytta till papperskorg/Deleted Items (inte permanent).
	158. Radera ska kräva explicit bekräftelse (modal + tydlig info).
	159. Radera ska vara allowlist‑styrt per mailbox + ha kill switch.
	160. Radera ska audit‑loggas (vad, vem, när, vilken mailbox).
	161. Radera ska vara idempotent (ingen dubbel‑delete loop).
	162. Radera ska inte vara default‑primärknapp (inte risk att klicka fel).

