# background-generator

This is a simple web application to provide semi-believable background details for fictional characters.  The now-official name is **CPREP**, ***C**haracter **P**rofile and **R**ecorded **E**vents (**P**rovisional)*.

As I described in the [Procedural Stories](https://github.com/jcolag/ProceduralStories) repository, an obvious problem in creating characters is in diversifying backgrounds, especially when it's far easier to assume that everybody looks like one's neighbors.  American sitcoms come to mind as a strong example, where a viewer can still somehow watch a show set in an urban center where ten out of ten people just happen to be white people in their twenties.

This tool, adapting that work, guesses at a random person on Earth, to take advantage of the full scope of diversity on the planet.

Unless something is broken, you should be able to try this out at <https://colagioia.net:5000>.

## Licensing Note

This project uses some code made available under the [MIT License](https://opensource.org/licenses/MIT), obliging its inclusion:

 > Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 >
 > The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 >
 > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Additionally, because the AGPL requires the offer to publish *all* code, the `config.json` file is released under the terms of the [CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/), so that any private keys you might put there aren't at risk by some jerk trying to break the system.

[This article](https://write.emacsen.net/breaking-the-agpl) starts to explain the problem, but never quite lands where I think it needs to be.

## Installation

There isn't *much* to configure, here, but there's a bit.

### Secure HTTP

To set this server up to run over HTTPS, you have two options, depending on where you're running.  If it's running on your local computer---and possibly your network, depending on your browser configuration---you'll want a self-signed certificate.

```sh
mkdir keys
cd keys
openssl req -nodes -new -x509 -keyout privkey.pem -out cert.pem
```

If it's on a real server, you'll need a real certificate, probably using [Let's Encrypt](https://letsencrypt.org/) and looking up how to install `certbot` on your own time, since it's free, but feel free to use any certificate instead.

```
certbot --webroot -w ./static -d domain.tld
ln -s /path/to/domain/keys keys
```

You'll need to replace `domain.tld` and `/path/to/domain/keys` to whatever directory contains your key and certificate.

If you can get this to run proxied behind a more general server like Apache, please file a pull request describing the process.  I was unable to get it working.

### Maps

If you want the maps to display properly, you'll need to create a [Mapbox](https://www.mapbox.com/) account, generate an API key, and paste it into the `config.json` file as the value to `mapboxToken`.

### Adding a Footer

If you want to include additional information on the page, you can optionally create `views/_footer.ejs` with the required text and `public/css/footer.css` for any styling that the footer might need.

The background generator will *only* use the files if it finds them, so there's no need to bother with this if you don't need it.

## Explanation and (Many) Caveats

In short, the program uses a population density map from Columbia University's [SEDAC](http://sedac.ciesin.columbia.edu/data/set/gpw-v4-population-density-rev10/data-download) to find a random latitude and longitude, then uses that information to find the country best represented by that location and the five nearest cities.

Note that:

 * Because of the rectangular projection used by the SEDAC maps, it's surprisingly common for selected coordinates to be out in the ocean or for the nearest cities to all be in a different country.
 * One degree of longitude by one degree of latitude is a *big* space, but that map is used because the file has a reasonable size.  In the downloads at the SEDAC site, you can also find maps whose cells are one kilometer by one kilometer.  The existing code should at least *mostly* work for those, though the other maps would need to be made to match.
 * A handful of countries recognized by SEDAC are not recognized by the rest of the world.

Given a country, the code then uses the JSON conversion of the [CIA World Factbook](https://github.com/iancoleman/cia_world_factbook_api) and other data to create a random skeletal background for the target person based on the country, including:

 * Age range
 * Gender Identity and Sexuality, including pronouns
   * Only non-gender or third-gender pronouns that can be found in public domain sources have been used.
   * In addition to non-binary people, based loosely on a [2020 survey](https://www.thetrevorproject.org/2020/07/29/research-brief-pronouns-usage-among-lgbtq-youth/), one eighth of all LGBTQ people will use non-binary pronouns.
   * In addition to LGBTQ people, one quarter of one percent of everyone else also opts for non-binary pronouns, because there's some anecdotal evidence of that happening for various reasons.
 * Religion
 * Ethnicity
 * Literacy
 * Average Skin Tone for the Region
 * Languages Spoken
 * Physical impairments and psychological disorders
 * A randomly-generated name, for countries where someone has provided data

Because the data is on the national level, the religion, ethnicity, and language information do *not* necessarily correlate appropriately with each other or with location.  For example, imagine a person with the following details.

 > 28S 46W 🌎: Brazil 🇧🇷; Male ♂ (bisexual 🏳️‍🌈), age 25 to 54, Spiritist 👻 (2.2%), mulatto (43.1%).

In this case, we have someone representing a tiny religious minority and a large ethnic minority.  The coordinates are near Rio de Janeiro, Brazil, closer to Lagoa.  So, are the "mulattos" (local term with a specific connotation, not the now-offensive English term) sufficiently represented around Rio to be likely?  Is there any overlap with Spiritists?  Do Spiritists tend to be in the 25 to 54 age bracket?  Unless you know the area well, it would take research to know definitively, and that research is probably beyond the scope of this project.

Ideally, this part of the generation would use each individual country's census information, but finding and packaging census information for every country in the world would require a prohibitive level of effort.

Along similar lines, in a sense, is the city database listing only cities above a certain population.  This will frequently show cities in nearby countries, if the city is across the border.  And in some extreme cases (for example, a low-population island), the "nearest city" might be thousands of miles away.

One additional problem (illustrated above) is the skin tone.  This is based on a [Luschan Skin Color Map](https://commons.wikimedia.org/wiki/Category:Human_skin_color#/media/File:Unlabeled_Renatto_Luschan_Skin_color_map.png) by [Dark Tichondrias](https://en.wikipedia.org/wiki/User:Dark_Tichondrias) on Wikimedia Commons (licensed [CC-BY-SA](http://creativecommons.org/licenses/by-sa/3.0/)).  As a conceptual artifact, such maps are necessarily outdated (this uses 1940 data) and reductive (it hides minority populations), but here we see the additional wrinkle that coastal regions have a tendency to show as water (#A4B2E2) or a latitude line (#000000), at which point the algorithm starts searching in concentric squares for a non-water point or bombing out to report its maximum radius in pixels.  There still may be cases where the *legend* is detected instead of a land mass, though.  Regardless, it's a starting point to help visualize the person.

Likewise, there isn't official, compiled reporting on non-binary gender populations, so the gender is limited to "male" and "female," with an attempt to apply very broad average representation on top of the binary.  The same (extremely weak) technique is used to include representation for people living with psychiatric disorders and physical impairments, who collectively make up a large part of the population.

Names are only the barest recommendation, relying on the data (but not the API, to prevent overloading their servers) for [UINames](https://uinames.com/), which can be found [here](https://raw.githubusercontent.com/thm/uinames/master/names.json) and proposed contributions (available under the [MIT License](https://opensource.org/licenses/MIT)) and should probably be refreshed periodically as the maintainers add countries and names.  Note that UINames only currently supports given name/surname pairs (reversed, for many East Asian countries) and knows nothing about different forms of name, and of course carries the same culture-blindness as the ethnicity/religion estimates.  In this case, "Diego Montes" sounds plausible, but in some cases, a name might be ignoring long-standing traditions and come off as insensitive or tone deaf.  As an obvious example for English speakers, it's possible to generate a name like "Thomas Thomas" in several countries, even though that would be a highly unlikely combination.

At some point, it might be worth investigating how to navigate and parse Wiktionary's [names by language](https://en.wiktionary.org/wiki/Category:Names_subcategories_by_language) category.  It would probably require another layer of mapping data and a fair amount of work, but would improve the chances of names sounding credible to native ears by drawing all components of a name from the same "language."  That is, while I wouldn't be confident in any Indian name that **CPREP** currently generates, I'd be willing to assume that ಮಹಾದೇವ ಕೃಷ್ಣ (Mahadeva Krishna) *is* probably reasonable, because I chose the given name and surname from Kannada lists.

In cases where the writing system isn't strictly the Latin alphabet, the name will also be transliterated, shown along the lines of `"康 肖" (Kang  Xiao)`.  Like many aspects, here, it's not advisable to take those results as anything more than a starting point, specifically since transliterations of Semitic languages won't include most vowels and the transliteration library doesn't seem to care about any difference between Chinese logograms and Japanese kanji, producing unpleasant results there---`"مهسا حسنی" (mhs Hsny)` (would ideally be *Mahsa Hassani* or similar) or `"直子 高橋" (Zhi Zi  Gao Qiao)` (should be the wildly different *Naoko Takahashi*)---and probably in other writing systems that I haven't noticed.

For the personalities, the code simply picks a random day of the year (always 1999 to avoid leap years) and a random year out of the twelve-year Chinese cycle.  Personality keywords are based on astrological interpretations, so---obviously---your mileage may vary.  You can make fun of astrology as much as you like, but it's a straightforward system in the public domain that turns a couple of numbers into a set of categories that a person is supposed to fit, which is *perfect* for this sort of project.  If that doesn't work for you, though, I also added something like a [Big Five](https://en.wikipedia.org/wiki/Big_Five_personality_traits) map; none of the writing on it is in the public domain, but it's sufficiently fact-based and the use is small enough that I wouldn't consider fifteen terms coverable by copyright.
