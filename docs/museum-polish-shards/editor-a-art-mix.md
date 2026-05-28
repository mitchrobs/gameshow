# Editor A Art Mix Audit

Audit date: 2026-05-28
Files read: `src/data/museum/curatedArtworks.json`, `src/data/museum/schedule.json`

## Summary

The current Museum 365 pack has 365 curated artworks and 365 scheduled entries. The prior high-repeat art-mix problems appear largely resolved: no exact title exceeds 2 uses, no computed object family exceeds 4 uses, all supported runtime sources are present, and the source/media/region mix passes the hard gates. The tightest constraints are source balance, where Smithsonian is 124/365 (34.0%) against a 35% cap and Smithsonian plus AIC is 218/365 (59.7%) against a 60% cap.

The pack can preserve all 365 IDs while meeting the object-specific copy rubric. `validate_curated_quality` reports no errors; object-specific surprising facts are 358/365 (98.1%) against a 292-record minimum, distinct surprising facts are 362, generic surprising facts are 0, and no weak/modest record is missing a hero note.

## Hard Gate Results

| Gate | Result | Notes |
|---|---:|---|
| Exact title count <= 2 | Pass | 18 titles occur exactly twice; none exceed 2. |
| Object family count <= 4 | Pass | Top computed family is `cope` at 4; `untitled` family is 3. |
| Each source <= 35% | Pass, tight | Smithsonian 124/365 = 34.0%. |
| Top two sources <= 60% | Pass, tight | Smithsonian + AIC = 218/365 = 59.7%. |
| No supported source at 0 | Pass | `aic`, `met`, `nga`, `rijks`, `smithsonian`, and `ycba` all present. |
| Monthly region cap | Pass | Closest: 2026-09 Global 13/13 major-region cap; 2026-09 Europe 12/12 Europe cap; 2026-10 Europe 12/12 Europe cap. |
| Painting + Print + Drawing <= 45% | Pass | 119/365 = 32.6%. |
| Photograph >= 20 | Pass | 82 photographs. |
| Weak generic/fragment records need hero reasons | Pass | 9 explicit "material literacy despite a modest object type" notes; 0 missing hero notes in weak-title sweep. |

## Source Counts

| Source | Count | Share |
|---|---:|---:|
| smithsonian | 124 | 34.0% |
| aic | 94 | 25.8% |
| met | 70 | 19.2% |
| nga | 44 | 12.1% |
| rijks | 21 | 5.8% |
| ycba | 12 | 3.3% |

## Media Counts

| Medium category | Count | Share |
|---|---:|---:|
| Photograph | 82 | 22.5% |
| Painting | 65 | 17.8% |
| Sculpture | 47 | 12.9% |
| Design | 38 | 10.4% |
| Textile | 29 | 7.9% |
| Drawing | 28 | 7.7% |
| Print | 26 | 7.1% |
| Ceramic | 19 | 5.2% |
| Metalwork | 16 | 4.4% |
| Glass | 13 | 3.6% |
| Furniture | 1 | 0.3% |
| Manuscript | 1 | 0.3% |

## Region Counts

| Region | Count | Share |
|---|---:|---:|
| Europe | 114 | 31.2% |
| Asia | 76 | 20.8% |
| North America | 69 | 18.9% |
| Global | 69 | 18.9% |
| Africa | 35 | 9.6% |
| Latin America | 1 | 0.3% |
| Middle East | 1 | 0.3% |

## First 30 Scheduled Objects

| # | Date | ID | Object | Call | Note |
|---:|---|---|---|---|---|
| 1 | 2026-04-23 | `smithsonian-fsg_F1907.232` | Lovers on a terrace with three musicians | Strong | Specific subject, non-flat metalwork opener; unknown maker is supported by object-specific copy. |
| 2 | 2026-04-24 | `smithsonian-fsg_F1904.315a-c` | An Orange Note: Sweet Shop | Strong | Specific Whistler painting; region is collection-lane Asia, but copy anchors title/medium/source. |
| 3 | 2026-04-25 | `ycba-30633` | Sheep-Washing, Windsor | Strong | Specific print subject; date unknown is acceptable with print-culture framing. |
| 4 | 2026-04-26 | `smithsonian-saam_1997.105.31` | Solola, Guatemala | Strong | Photograph diversity arrives early and copy is object-specific. |
| 5 | 2026-04-27 | `met-544320` | Stela of the Steward Mentuwoser | Strong | Major African/Ancient Egypt anchor with clear object function and material. |
| 6 | 2026-04-28 | `smithsonian-fsg_F1904.187` | Flying Cuckoo | Strong | Specific Hokusai subject; good visual contrast after metalwork/design. |
| 7 | 2026-04-29 | `smithsonian-npg_S_NPG.2002.184.764` | Unidentified Woman | Weak but covered | Generic portrait title; hero reason explicitly frames material literacy. |
| 8 | 2026-04-30 | `aic-116964` | Boar Sword | Strong | Distinct object silhouette and material. |
| 9 | 2026-05-01 | `smithsonian-fsg_F1899.37` | Shiga ware cylindrical tea bowl in Oribe style | Strong | Specific ceramic form; useful material and cultural contrast. |
| 10 | 2026-05-02 | `smithsonian-fsg_F1917.234a-b` | Harmony in Green and Rose: The Music Room | Strong | Specific painting; second Whistler is close but not a title/family gate issue. |
| 11 | 2026-05-03 | `ycba-1096` | Newark Abbey | Watch | Title reads as a place/landscape while medium/category are `Sculpture` and date is unknown; source/media check recommended. |
| 12 | 2026-05-04 | `aic-62808` | Khosrow and Shirin in a Garden | Strong | Specific manuscript scene; strong non-Western narrative object. |
| 13 | 2026-05-05 | `met-53429` | Cherry Blossom Viewing at Itsukushima and Yoshino | Strong | Rich subject and material; supports Asia without leaning on painting/print only. |
| 14 | 2026-05-06 | `smithsonian-saam_1999.97.23` | Chagres, Panama | Strong | Photograph count and geographic variety both benefit. |
| 15 | 2026-05-07 | `smithsonian-nmafa_2004-7-8` | Processional cross | Strong | Clear African Art devotional object; exact title duplicate count is only 2. |
| 16 | 2026-05-08 | `met-544740` | Yuny and His Wife Renenutet | Strong | Named subject and Ancient Egypt material anchor. |
| 17 | 2026-05-09 | `smithsonian-fsg_F1911.443a-e` | Powdered tea container (natsume) | Strong | Specific use-object with lacquer/material hook. |
| 18 | 2026-05-10 | `aic-56905` | Nocturne: Blue and Gold - Southampton Water | Strong | Recognizable painting, good Global lane use. |
| 19 | 2026-05-11 | `ycba-45` | Wreckers -- Coast of Northumberland | Watch | Same YCBA concern: landscape title with `Sculpture` medium/category and unknown date. |
| 20 | 2026-05-12 | `smithsonian-fsg_F1904.273` | Travelers | Watch | Broad title and objectDate `1760-1849` may be maker-life-date-like; keep if source confirms object dating. |
| 21 | 2026-05-13 | `aic-26607` | Precincts of Kameido Tenjin Shrine | Strong | Specific Hiroshige print and strong series context. |
| 22 | 2026-05-14 | `smithsonian-saam_1999.97.20` | The Plaza, Panama | Strong | Third Muybridge in first month but titles/subjects differ and photo target benefits. |
| 23 | 2026-05-15 | `aic-75557` | Manuscript of Kulliyat by Sa'di | Strong | Manuscript/drawing slot has specific title and material. |
| 24 | 2026-05-16 | `smithsonian-npg_NPG.76.76` | Thomas Hicks | Strong | Named photographic portrait; unknown maker is not a hero blocker. |
| 25 | 2026-05-17 | `aic-65709` | The Artist in His Studio | Strong | Specific studio subject and Global/painting balance is fine. |
| 26 | 2026-05-18 | `ycba-5011` | Inverary Pier, Loch Fyne: Morning | Watch | Third early YCBA `Sculpture` medium/category mismatch candidate. |
| 27 | 2026-05-19 | `met-53162` | Tobatsu Bishamonten | Strong | Distinct Japanese sculpture; strong material and date. |
| 28 | 2026-05-20 | `smithsonian-npg_S_NPG.2002.184.871` | Unidentified Man | Weak but covered | Generic title; explicit material-literacy hero note supports keeping. |
| 29 | 2026-05-21 | `smithsonian-nmafa_2002-21-1` | Hand cross | Strong | Clear object type; duplicate title count is only 2. |
| 30 | 2026-05-22 | `met-544449` | Large Kneeling Statue of Hatshepsut | Strong | High-confidence anchor object with specific subject and material. |

## Replacement Risk

No replacement is required by the hard art-mix gates. The pack is now balanced enough to preserve all 365 IDs if metadata/source review is allowed to polish a few records.

Likely review or replacement candidates if the team wants zero metadata doubt:

| ID | Date | Risk | Recommendation |
|---|---|---|---|
| `ycba-1096` | 2026-05-03 | `Newark Abbey` has landscape/place title, unknown date, and `Sculpture` as both medium and category. | Source-check media; replace only if source cannot support the current category. |
| `ycba-45` | 2026-05-11 | `Wreckers -- Coast of Northumberland` has the same YCBA media/category concern. | Source-check media before final hero copy. |
| `ycba-5011` | 2026-05-18 | `Inverary Pier, Loch Fyne: Morning` has the same YCBA media/category concern. | Source-check media before final hero copy. |
| `ycba-42740` | 2027-04-15 | `Bachelors' Hall: The Hunt Breakfast` is another YCBA `Sculpture` record with unknown date. | Source-check media; not a mix-gate replacement by itself. |
| `smithsonian-chndm_1936-4-207` | 2026-07-04 | `Tsuba` is tagged North America / United States even though the title is a Japanese sword-guard term. | Review region/origin; replace only if source review cannot reconcile the tag. |
| `smithsonian-fsg_F1904.273` | 2026-05-12 | `Travelers` is broad and its objectDate `1760-1849` may be a maker-life range rather than an object date. | Source-check date display; likely keep with corrected label if confirmed. |

The weaker-but-covered object group is not a replacement requirement: two `Weight` records, four `Unidentified Man/Woman` silhouette records, one floor-mosaic fragment, and two study records all have explicit hero rationale and do not breach title/family caps.

## Preservation Verdict

Yes, preserve all 365 IDs for this art-mix pass. Replacement should be optional and limited to source/media verification failures, not driven by the current mix gates. The largest residual risk is not quantity balance; it is a small set of source-derived metadata labels that could make object-specific copy look overconfident if left unchecked.
