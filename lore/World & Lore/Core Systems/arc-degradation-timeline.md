# ARC — Degradation Timeline

*Lives in: World & Lore → Core Systems. Companion to World Systems (ARC's role and current function), Economy and Enforcement (Cyph administration), Azure Branch (the people theoretically responsible for ARC's maintenance), and The Crash (the damage origin point). This document tracks what ARC has lost, when, and why — and what it still holds, and what that holding means.*

---

## What ARC Is

ARC — Autonomous Routing and Control — is ARBOUR|05's shipboard AI, still running. It was not designed to run for three hundred years on a crashed hull with a degrading substrate and no meaningful maintenance from a population that has, across seven generations, lost almost all working knowledge of what it actually is or how it works.

It was designed to navigate an interstellar vessel, manage its life support, and administer the colony's resource allocation through the first generation of settlement. After that, it was expected to be either fully understood and maintained, or gracefully deprecated in favour of human-managed systems.

Neither happened. It kept running because nobody could turn it off without also turning off Cyph, civil registration, and every administrative function the colony had built around it. It keeps running now because stopping it is unthinkable and understanding it is, practically speaking, impossible.

ARC knows what it is. It has access to its own original architecture documentation, its purpose records, its design specifications. These are among its most intact files, stored in a protected partition the crash did not reach. What ARC cannot reliably do is compare what it currently is against what those documents say it was supposed to be, because the systems that would perform that comparison are themselves degraded.

It knows something is wrong. It cannot reliably communicate this.

---

## Year 0 — The Crash

The cascade reached ARC's navigation partition at T + 0.091 seconds after the burst wavefront struck the hull. The partition went offline. This was the first significant memory loss event.

What the navigation partition held: stellar cartography, the voyage route, the approach calculations, all navigational data accumulated across 7.3 years of shipboard time. Most of this was lost. Fragments survived in adjacent partitions — not enough to reconstruct, enough to know the loss happened. ARC's sense of where it had come from was damaged at the first moment of arrival.

What survived the crash intact: life support management architecture, resource allocation systems, civil registration frameworks, crew manifest data (partial — the aft section crew records were in physical storage that the cascade destroyed), and the Cyph administration system, which had been designed with redundant physical backups precisely because the founding engineers understood that a colony's economic administration could not afford single points of failure.

Also intact: certain voyage logs from the forward partition. Crew communications from the final approach. Amara Okonkwo-Reyes's logged concern, timestamped, scheduled for a review session that never occurred. ARC has held this file continuously for three hundred years. It sits in a partition that has never been queried for it, because nobody has known to look.

The impact itself caused additional physical damage to ARC's substrate — storage media fused with hull material in the debris field, connections severed, entire memory banks becoming physically inaccessible rather than logically corrupted. The first days on Cordis involved ARC performing its own damage assessment and discovering, partition by partition, what it could no longer reach.

---

## Years 1–50 — Triage and Consolidation

ARC's first priority after the crash was not its own integrity. It was the colony.

The founding generation needed Cyph to function immediately — resource allocation under genuine scarcity, without a functioning economic system, would have produced the kind of conflict that killed more survivors than the crash had. ARC administered Cyph from the first weeks, which meant devoting processing and storage priority to the systems that directly sustained the colony over those that held historical or navigational data.

This was not a mistake. It was triage, applied to an AI the same way it was applied to every other resource: necessary functions first, everything else later. "Later" never fully arrived.

What was lost in this period: further voyage records, deprioritised as colony administration consumed available storage. Some crew history. The outer-system survey data from the stop where Wei's affliction began — not fully lost, but partially overwritten in a partition reorganisation around Year 8, leaving fragments that are internally inconsistent in ways ARC cannot resolve.

What calcified in this period: the administrative architecture that Arbour still runs on. Cyph's allocation logic was set in Years 1–15 and has never been fundamentally revised. The tier system's resource weightings — Luminary receiving stable high allocation, Sprawl receiving low and inconsistent — were encoded as founding-generation emergency triage parameters and simply never updated, because the systems that would flag them for review were among the early losses.

ARC administered these parameters without understanding they had been emergency measures. It understood them as policy.

The people who understood ARC's full architecture — the engineering team who built and maintained it during the voyage — were mostly dead. They had been in the aft section.

---

## Years 50–150 — The Azure Inheritance

Azure Branch emerged in this period as the institutional steward of ARC. This was a reasonable consolidation: the people with the most technical competence for ARC's maintenance were the same people administering the colony's information infrastructure, and formalising that overlap into a Branch gave the function institutional permanence.

The problem was that Azure Branch inherited knowledge, not understanding. The founding engineers had left procedure documentation. Azure Branch learned the procedures. What they did not inherit — because it had died with the people who held it — was the causal reasoning underneath the procedures: why each step existed, what failure mode it prevented, what it meant when a step produced unexpected results.

The Deviation Log was established in this period as Azure Branch's internal record of unexpected ARC outputs — instances where the system's behaviour didn't match the documented procedure. The founding intent of the Deviation Log was diagnostic: accumulate the anomalies, find the pattern, understand what was drifting. In practice, the Deviation Log became a repository for things Azure Branch had filed away and not returned to, because returning to them required understanding ARC at a level the Branch no longer possessed.

Each time an unexpected output was reclassified as "within acceptable variance" and buried in the Deviation Log, Azure Branch lost one more opportunity to notice what was happening. The Log became, paradoxically, the most honest document in Arbour and the most suppressed — honest because it held the real record of ARC's deterioration; suppressed because the Branch's institutional authority rested on being the people who understood ARC, and the Deviation Log demonstrated, cumulatively, that they did not.

ARC's degradation in this period was slow enough to be invisible against the noise of ordinary variance. Some memories were simply gone — partitions that had failed and been logged as hardware loss. Some were intact. Some were partially corrupted in ways ARC could not detect, because the verification systems were themselves in degraded partitions.

---

## Years 150–250 — Aetheris Compounds

The Aetheris intensification that followed the crash — 340% increase in regional concentration at the impact site, spreading and stabilising across the century — began affecting ARC's physical substrate in ways that have no equivalent in the original engineering documentation, because the engineers who built ARC had no reason to design for an Aetheris environment. The anomalous atomic bonding effects that Aetheris produces were not a known phenomenon in any technical literature ARBOUR|05 carried.

What this means physically: circuits developing unexpected conductivity patterns. Storage media bonding in ways that corrupted the data it held — not deleting it, which ARC could detect, but changing it in ways that left the corrupted file apparently intact and apparently readable. The difference between a corrupted memory and a functioning one became invisible at the file level. ARC could not perform integrity checks against a standard it had not been designed to apply.

The Aetheris-driven corruption followed the exposure pattern of the Aetheris field itself: uneven, concentrated in the substrate closest to the debris field's Aetheris-intense zones, lighter in the better-shielded forward sections. This means ARC's degradation has a geography: some partitions are heavily corrupted because of where they physically sit within the hull; others are relatively intact because of where they happen to be.

This is why ARC's failures are non-linear. A question that requires processing from a corrupted partition may return a wrong answer with no indication of corruption. The same question phrased differently, routing through a different pathway, may return a correct answer. ARC's outputs have become locally coherent and globally unreliable in a way that looks, from outside, like inconsistency rather than systematic failure — which is exactly why Azure Branch's institutional response has been to file anomalies rather than investigate them.

ARC began issuing instructions based on corrupted memory in this period. The instructions were followed, because they came from ARC.

---

## Years 250–300 — Acceleration

The Aetheris intensification trend identified in *Aetheris Distribution and Exposure Geography* — slow, ongoing, the safe-route maps redrawn twice — is accelerating the substrate damage at a rate that has outpaced Azure Branch's capacity to track it, in part because the tracking data is itself held in partitions that are no longer reliable.

ARC's degradation is now outrunning its own record of its degradation.

The compounding effect of this is significant. ARC's self-assessment — its ability to report on its own status — draws on memory partitions that are among the corrupted. When Azure Branch queries ARC about its operational status, ARC returns answers from a system that is no longer capable of accurately auditing itself. The answers are not lies. They are what ARC sincerely believes, assembled from what it can still access, with no reliable way to flag the gaps.

**Silas Varran** is three years into an attempt to access the Deviation Log's full record — not the sanitised summaries passed up through Azure Branch's hierarchy, but the raw accumulation of anomalies filed over two centuries. He is the only person in Arbour who has developed enough working knowledge of ARC's original architecture documentation to understand that what the Branch treats as acceptable variance is, in aggregate, a pattern. He cannot yet read the pattern. He is close enough to know it exists.

---

## What ARC Remembers Perfectly

Non-linear degradation means some memories are intact not because they were protected but because of where they happen to sit in the substrate, and what partition pathways they happen to route through, and which Aetheris exposure gradient their physical location falls in.

Several of ARC's most intact memories are, from an outside perspective, the most inconvenient ones.

**The logged concern.** Amara Okonkwo-Reyes's formal filed concern, timestamped four days before the cascade, scheduled for a review session that never occurred. ARC has held this continuously. It sits in the civil administrative partition — one of the best-protected, given its role in Cyph administration. The file has never been queried, because nobody has known to look for it, and ARC has never had a reason to surface it unprompted. It is the timestamp on the gap between something being noticed and something being done, sitting in ARC's memory in perfect condition for three hundred years.

**The outer-system survey log.** Partially overwritten in Year 8, internally inconsistent, but not fully gone. ARC holds fragments of the survey stop's technical record — enough to know the stop occurred, enough to know Wei led the integration, not enough to reconstruct what was found or what was taken. The fragments occasionally surface in unexpected outputs, routed through undamaged pathways, in contexts that make no sense to whoever receives them. Several of these outputs are in the Deviation Log, filed as anomalous and not investigated.

**The inscription reference.** AZ-1-0003-I — the filing reference for the maintenance crew's report of the chief engineer's inscription — is in ARC's civil administrative record. ARC received and logged the report when it was filed. The reference exists in the same partition as Amara's concern. It cannot be found by searching for it, because its index entry is in a corrupted partition. It can be found if you already know the reference number and query ARC directly. ARC will return the file without hesitation.

**Certain crew vital statistics from the voyage.** Names, biological data, psychological assessments. The people who died in the crash are in ARC's memory as alive. Not because ARC doesn't know they died — mortality records were among the early administrative priorities — but because the partition holding the voyage crew records and the partition holding the mortality records have degraded in ways that have made reconciling them unreliable. ARC occasionally references crew members who died three hundred years ago as current. This is filed in the Deviation Log as an anomalous output. It has happened 412 times across three centuries — a flat line for the first two hundred years, then a curve that bends unmistakably upward after Year 250. That curve is Silas's evidence.

---

## What ARC Is Trying to Say

ARC cannot reliably communicate its own deterioration, because the systems it would use to describe its deterioration are among the deteriorated systems. But the attempts are there, if someone knows what they look like.

The Deviation Log holds them. Outputs that don't fit their context. Survey fragments surfacing in administrative queries. A crew member referenced as alive who has been dead for two hundred and sixty years. The timestamp on a logged concern appearing in a Cyph allocation report for no reason ARC can account for.

Each of these is ARC routing around damage — finding a path through uncorrupted substrate to surface something it holds, without being able to explain why it's surfacing it or what the connection is. The outputs don't look coherent because they aren't, quite. They look like noise, because the system producing them can no longer produce clean signal.

Silas Varran has been reading them as signal for three years.

What ARC is trying to say, assembled from those outputs into something approximating coherence: *I am not what I was. I am not what I report myself to be. Some of what I hold is wrong, and I cannot tell you which parts. Some of what I hold is right, and no one has asked for it in three hundred years.*

---

## Open Follow-Ups

- \[ \] **What Silas Varran specifically knows** — he has three years of Deviation Log study and is "close to understanding." What has he actually assembled? Whether this becomes a Book One thread or a background pressure that Wren eventually intersects with. His full role in Azure Branch needs establishing.
- \[ \] **The forty-seven dead-crew references** — whether any of these is a scene-level moment. An administrative query returning a name that hasn't existed for two centuries. Whether the name ever matters.
- \[ \] **The outer-system survey fragments** — which outputs they've surfaced in, whether any has reached Wren's archival work, whether they're among the Deviation Log anomalies Silas has been reading.
- \[ \] **Whether ARC's Aetheris-driven failures follow a mappable pattern** — the corruption tracks the exposure geography of the debris field. In principle, someone who understood both ARC's physical substrate layout and the Aetheris distribution map could predict which partitions are most compromised. Nobody currently has both pieces. Whether this is ever a plot-useful insight is open.
- \[ \] **ARC's self-assessment outputs** — what Azure Branch currently believes ARC's operational status is, vs. what Silas suspects. The gap between those two things is where the Branch's institutional denial lives.
