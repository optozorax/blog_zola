+++
title = "There should be no \"Spam\" folder"
date = 2021-02-09
description = "It's an incredibly terrible solution, and I propose a more sensible one."

[taxonomies]
tags = ["thoughts", "ideas", "interface"]

[extra]
image = "spam.jpg"
tg = "https://t.me/optozorax_dev/309"
tg_comments = 45

[extra.translation]
from = "ru"
by = "Claude Opus 5.5"
+++

When you sign up on a website, email is very often used to activate the account. And almost every site, after sending the email, tells you: "Check your 'Spam' folder, the email may have accidentally ended up there." That right there is the main problem. Every email service forces this folder on us, and emails get put there by some magic algorithms whose defining feature is that they make mistakes.

Because spam detection algorithms always make mistakes and work who knows how, we develop a paranoia that makes us check this folder all the time, wasting precious seconds. And if we don't check it, we can sometimes miss important mail.

I believe there should be no "Spam" folder by default. Everything should be based on filters, and filters should get big fat buttons and a more convenient and accessible interface.

In all the time I've been using email, I've learned the most important thing: if some address has started spamming you once and you can't unsubscribe from it, it will spam you forever. Likewise, if some address sends you important emails, it will never send you spam, and if it does, there will be a little "Unsubscribe" button. This is the property we'll rely on from here on.

Say, for example, an email lands in your inbox and you see that it's spam. How do you deal with it if there's no such folder? That's what the concept of filters was invented for. You can manually set up a filter that automatically deletes such emails. In regular email services, to do that you have to go into the settings, figure out how filters work and stare at a pile of fields, so nobody does it, everyone's too lazy. So the interface needs to be simplified: for example, instead of the "Mark as spam" button, there could be a button for the most common filter case: "Delete all emails from this address". And of course, after you click this button, all the existing emails from this address should be deleted automatically too, because nobody is going to dig into the settings to do it by hand, and because of the property, remember? Great, now 90% of the use cases for the "Spam" folder are wiped out.

Another kind of spam is when a person gets emails from all sorts of different addresses every day, and they physically can't filter them all by themselves. I think only in this case should there be a button "How about you give me a spam folder and fire up your magic algorithms". Although even in this case I wouldn't trust the algorithms and would do it differently. Here we can introduce the concept of "Trusted email addresses/domains". With this concept there should be two inbox folders: unknown and known. All emails from unknown addresses should go into the corresponding folder, and likewise for known ones. There should be a list of all known addresses that you can view and edit in the settings. And again, when you come across such an email, nobody is going to dig into the settings, so to make an address trusted, every email should simply have a button "Trust the address that sent this email", and vice versa. And right after that, all emails from this address should move from the unknown folder to the known folder, because, again, the property. This way a person can get emails from thousands of different spam addresses every day, but they will never miss an important email, and no "Spam" folders are needed.

That's it: now we've not only gotten rid of the idiotic concept of a spam folder, but also created an interface that is a hundred times more powerful, convenient and useful, one that empowers its user instead of weakening them.

---

Too bad you can't turn this folder off in Gmail.

By the way, recently my Twitter activation email went to spam, and I kept wondering why the email was taking so long to arrive :).
