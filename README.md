# background-generator

This is a simple web application to provide semi-believable background details for fictional characters.

As I described in the [Procedural Stories](https://github.com/jcolag/ProceduralStories) repository, an obvious problem in creating characters is in diversifying backgrounds, especially when it's far easier to assume that everybody looks like one's neighbors.  American sitcoms come to mind as a strong example, where a viewer can still somehow watch a show set in an urban center where ten out of ten people just happen to be white people in their twenties.

This tool, adapting that work, guesses at a random person on Earth, to take advantage of the full scope of diversity on the planet.

Unless something is broken, you should be able to try this out at <https://colagioia.net:5000>.

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
 * Gender Identity and Sexuality
 * Religion
 * Ethnicity
 * Literacy
 * Average Skin Tone for the Region
 * Languages Spoken
 * Physical impairments and psychological disorders
 * A randomly-generated name

Because the data is on the national level, the religion, ethnicity, and language information do *not* necessarily correlate appropriately with each other or with location.  For example, imagine a person with the following details.

 > 28S 46W 🌎: Brazil 🇧🇷; Male ♂ (bisexual 🏳️‍🌈), age 25 to 54, Spiritist 👻 (2.2%), mulatto (43.1%).

In this case, we have someone representing a tiny religious minority and a large ethnic minority.  The coordinates are near Rio de Janeiro, Brazil, closer to Lagoa.  So, are the "mulattos" (local term with a specific connotation, not the now-offensive English term) sufficiently represented around Rio to be likely?  Is there any overlap with Spiritists?  Do Spiritists tend to be in the 25 to 54 age bracket?  Unless you know the area well, it would take research to know definitively, and that research is probably beyond the scope of this project.

Ideally, this part of the generation would use each individual country's census information, but finding and packaging census information for every country in the world would require a prohibitive level of effort.

Along similar lines, in a sense, is the city database listing only cities above a certain population.  This will frequently show cities in nearby countries, if the city is across the border.  And in some extreme cases (for example, a low-population island), the "nearest city" might be thousands of miles away.

One additional problem (illustrated above) is the skin tone.  This is based on a [Luschan Skin Color Map](https://commons.wikimedia.org/wiki/Category:Human_skin_color#/media/File:Unlabeled_Renatto_Luschan_Skin_color_map.png) by [Dark Tichondrias](https://en.wikipedia.org/wiki/User:Dark_Tichondrias) on Wikimedia Commons (licensed [CC-BY-SA](http://creativecommons.org/licenses/by-sa/3.0/)).  As a conceptual artifact, such maps are necessarily outdated (this uses 1940 data) and reductive (it hides minority populations), but here we see the additional wrinkle that coastal regions have a tendency to show as water (#A4B2E2) or a latitude line (#000000), at which point the algorithm starts searching in concentric squares for a non-water point or bombing out to report its maximum radius in pixels.  There still may be cases where the *legend* is detected instead of a land mass, though.  Regardless, it's a starting point to help visualize the person.

Likewise, there isn't official, compiled reporting on non-binary gender populations, so the gender is limited to "male" and "female," with an attempt to apply very broad average representation on top of the binary.  The same (extremely weak) technique is used to include representation for people living with psychiatric disorders and physical impairments, who collectively make up a large part of the population.

Names are only the barest recommendation, relying on the data (but not the API, to prevent overloading their servers) for [UINames](https://uinames.com/), which can be found [here](https://raw.githubusercontent.com/thm/uinames/master/names.json) and proposed contributions (available under the [MIT License](https://opensource.org/licenses/MIT)) and should probably be refreshed periodically as the maintainers add countries and names.  Note that UINames only currently supports given name/surname pairs (reversed, for many East Asian countries) and knows nothing about different forms of name, and of course carries the same culture-blindness as the ethnicity/religion estimates.  In this case, "Diego Montes" sounds plausible, but in some cases, a name might be ignoring long-standing traditions and come off as insensitive or tone deaf.  As an obvious example for English speakers, it's possible to generate a name like "Thomas Thomas" in several countries, even though that would be a highly unlikely combination.

At some point, it might be worth investigating how to navigate and parse Wiktionary's [names by language](https://en.wiktionary.org/wiki/Category:Names_subcategories_by_language) category.  It would probably require another layer of mapping data and a fair amount of work, but would improve the chances of names sounding credible to native ears.

In cases where the writing system isn't strictly the Latin alphabet, the name will also be transliterated, shown along the lines of `"康 肖" (Kang  Xiao)`.  Like many aspects, here, it's not advisable to take those results as anything more than a starting point, specifically since transliterations of Semitic languages won't include most vowels and the transliteration library doesn't seem to care about any difference between Chinese logograms and Japanese kanji, producing unpleasant results there---`"مهسا حسنی" (mhs Hsny)` (should be *Mahsa Hassani*) or `"直子 高橋" (Zhi Zi  Gao Qiao)` (should be *Naoko Takahashi*)---and probably in other writing systems that I haven't noticed.
