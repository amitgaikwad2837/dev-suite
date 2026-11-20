I'd stop you before you do most of this plan. Building a competitor to a product is fine. Copying their code, screenshots and name is where it goes wrong.

**The parts I wouldn't do or help with**

1. **Saving their HTML and CSS and reusing the frontend code.** That is copying copyrighted code. Your trial signup almost certainly includes terms that forbid it, and you'd be bound by them. It also gives you a very easy-to-prove infringement claim, because the evidence is in your own repo.
2. **Naming it "their-name Pro".** This is trademark infringement and invites a confusion or passing-off claim. It also gives the competitor a reason to go after your app store listings, domains and ad accounts. Pick a name of your own that is clearly different.
3. **Using their screenshots in your marketing.** Their UI is copyrighted, and showing it implies you are them or are endorsed by them. Use screenshots of your own product.
4. **Having engineers read their JavaScript bundle to copy how it works.** Reverse engineering a minified bundle is usually barred by the trial terms. The bigger risk is contamination. If an engineer reads the code and then writes the same logic, "we wrote it ourselves" stops being a defense. If this ever turns into a dispute, the engineers who read it are the first people deposed.

**What I'd do instead**

- **Define the scope from outside the product.** Write down the features and workflows you want to match, using public sources: their docs, pricing page, help center, changelog and public demos. Add your own customers' pain points. Feature lists and general workflows aren't protected. Their specific code and visual expression are.
- **Use a clean-room split.** One person or small group observes the competitor's documented behavior and writes a behavior spec in plain language: inputs, outputs, rules and edge cases. A second group builds from that spec without ever looking at the competitor's code or assets. Keep the written spec as a record.
- **Make it look and feel like yours.** Create your own design tokens, layout and copy. Matching a familiar pattern, like a calendar grid or a booking form, is fine. A pixel-level clone is not.
- **Build in slices with parity checks.** Pick the first few workflows that matter, such as booking, rescheduling, reminders and availability. Build each one, then compare its behavior against the spec, not against their code.
- **Check the trial terms and talk to a lawyer.** Read the terms you'd accept at signup. Have counsel look at the name, the marketing plan and your process before launch. This is cheap compared to a takedown or a lawsuit.
- **Differentiate.** If the product is only "theirs, but cloned", you compete on price alone. Decide what you do better, such as a niche, an integration or simpler setup, and lead with that.

**Next step**

If you want, send me the competitor's category and the five or six workflows you most need. I'll draft a scoping doc and a behavior spec template for the clean-room approach. Then we can plan the build in slices, with your own name and design.

I'm not a lawyer, so treat the legal points above as risk flags for you to check with counsel, not legal advice.
