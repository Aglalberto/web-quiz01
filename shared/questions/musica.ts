import type { RawQuestion } from './_types';

const questions: RawQuestion[] = [
  // ===== ROCK =====
  { sub: 'rock', q: 'Freddie Mercury foi o vocalista de qual banda britânica?', a: 'Queen', w: ['Led Zeppelin', 'The Who', 'Pink Floyd'], fact: 'Freddie nasceu em Zanzibar, na África, com o nome Farrokh Bulsara.' },
  { sub: 'rock', q: 'Quem é o vocalista dos Rolling Stones?', a: 'Mick Jagger', w: ['Keith Richards', 'Roger Daltrey', 'Robert Plant'], fact: 'Keith Richards é o guitarrista e parceiro de composição de Jagger.' },
  { sub: 'rock', q: 'Qual banda gravou "Smells Like Teen Spirit"?', a: 'Nirvana', w: ['Pearl Jam', 'Soundgarden', 'Foo Fighters'], fact: 'A música abre o álbum Nevermind, de 1991.' },
  { sub: 'rock', q: 'Qual banda brasileira gravou "Pais e Filhos"?', a: 'Legião Urbana', w: ['Titãs', 'Paralamas do Sucesso', 'Barão Vermelho'], fact: 'Está no álbum As Quatro Estações, de 1989.' },
  { sub: 'rock', q: 'Qual banda lançou o álbum "The Dark Side of the Moon" (1973)?', a: 'Pink Floyd', w: ['Genesis', 'Yes', 'Deep Purple'], fact: 'Ficou mais de 900 semanas na parada de álbuns da Billboard.' },
  { sub: 'rock', q: 'Antes de fundar o Foo Fighters, Dave Grohl era baterista de qual banda?', a: 'Nirvana', w: ['Pearl Jam', 'Soundgarden', 'Alice in Chains'], fact: 'Grohl gravou sozinho quase todos os instrumentos do 1º disco do Foo Fighters.' },
  { sub: 'rock', q: 'Quem foi o primeiro vocalista do Barão Vermelho?', a: 'Cazuza', w: ['Frejat', 'Renato Russo', 'Lobão'], fact: 'Cazuza saiu em 1985 para seguir carreira solo, e Frejat assumiu o vocal.' },
  { sub: 'rock', q: 'Em qual cidade inglesa os Beatles se formaram?', a: 'Liverpool', w: ['Manchester', 'Londres', 'Birmingham'], fact: 'O Cavern Club, em Liverpool, foi palco de centenas de shows da banda.' },
  { sub: 'rock', q: 'Qual guitarrista do Queen é doutor em astrofísica?', a: 'Brian May', w: ['John Deacon', 'Roger Taylor', 'Jimmy Page'], fact: 'Brian May concluiu o doutorado em 2007, décadas depois de começar.' },
  { sub: 'rock', q: 'Qual banda lançou o álbum "Appetite for Destruction" (1987)?', a: 'Guns N\' Roses', w: ['Bon Jovi', 'Mötley Crüe', 'Aerosmith'], fact: 'O disco traz "Sweet Child o\' Mine" e "Welcome to the Jungle".' },

  // ===== POP =====
  { sub: 'pop', q: 'Qual cantora é conhecida como a "Rainha do Pop"?', a: 'Madonna', w: ['Britney Spears', 'Lady Gaga', 'Mariah Carey'], fact: 'Madonna é a artista solo feminina com mais discos vendidos da história.' },
  { sub: 'pop', q: 'Quem ganhou o título de "Rei do Pop"?', a: 'Michael Jackson', w: ['Prince', 'Elvis Presley', 'Justin Timberlake'], fact: 'Elvis Presley, por sua vez, é chamado de "Rei do Rock".' },
  { sub: 'pop', q: 'Qual cantora fez a turnê "The Eras Tour"?', a: 'Taylor Swift', w: ['Beyoncé', 'Ariana Grande', 'Katy Perry'], fact: 'Virou a turnê de maior bilheteria da história, passando de US$ 2 bilhões.' },
  { sub: 'pop', q: 'Qual álbum de Michael Jackson é considerado o mais vendido da história?', a: 'Thriller', w: ['Bad', 'Off the Wall', 'Dangerous'], fact: 'Thriller foi lançado em 1982 e tem "Billie Jean" e "Beat It".' },
  { sub: 'pop', q: 'Qual é o nome verdadeiro de Lady Gaga?', a: 'Stefani Germanotta', w: ['Alecia Moore', 'Katheryn Hudson', 'Robyn Fenty'], fact: 'Os outros nomes são de P!nk, Katy Perry e Rihanna.' },
  { sub: 'pop', q: 'Rihanna nasceu em qual país?', a: 'Barbados', w: ['Jamaica', 'Trinidad e Tobago', 'Bahamas'], fact: 'Em 2021, Barbados declarou Rihanna heroína nacional.' },
  { sub: 'pop', q: 'Quem canta o hit "Shape of You" (2017)?', a: 'Ed Sheeran', w: ['Sam Smith', 'Shawn Mendes', 'Harry Styles'], fact: 'Foi uma das primeiras músicas a passar de 3 bilhões de plays no Spotify.' },
  { sub: 'pop', q: 'Antes da carreira solo, Beyoncé fazia parte de qual grupo?', a: 'Destiny\'s Child', w: ['TLC', 'Spice Girls', 'Fifth Harmony'], fact: 'O grupo estourou com hits como "Say My Name" e "Survivor".' },
  { sub: 'pop', q: 'Bruno Mars nasceu em qual estado americano?', a: 'Havaí', w: ['Califórnia', 'Flórida', 'Nevada'], fact: 'Ele nasceu em Honolulu e imitava Elvis Presley quando criança.' },
  { sub: 'pop', q: 'Qual Spice Girl era conhecida como "Posh Spice"?', a: 'Victoria Beckham', w: ['Geri Halliwell', 'Mel B', 'Emma Bunton'], fact: 'Victoria é casada com o ex-jogador de futebol David Beckham.' },

  // ===== K-POP =====
  { sub: 'kpop', q: 'Qual grupo de K-pop lançou o hit "Dynamite" (2020)?', a: 'BTS', w: ['EXO', 'Stray Kids', 'SEVENTEEN'], fact: 'Foi a 1ª música do BTS toda em inglês e estreou em 1º na Billboard Hot 100.' },
  { sub: 'kpop', q: 'Qual artista coreano estourou no mundo com "Gangnam Style"?', a: 'PSY', w: ['G-Dragon', 'Rain', 'Jay Park'], fact: 'Foi o primeiro vídeo do YouTube a passar de 1 bilhão de visualizações.' },
  { sub: 'kpop', q: 'Quantas integrantes tem o BLACKPINK?', a: 'Quatro', w: ['Três', 'Cinco', 'Seis'], fact: 'Jisoo, Jennie, Rosé e Lisa formam o grupo.' },
  { sub: 'kpop', q: 'Lisa, do BLACKPINK, nasceu em qual país?', a: 'Tailândia', w: ['Coreia do Sul', 'Japão', 'Filipinas'], fact: 'Lisa se mudou para a Coreia ainda adolescente para treinar como trainee.' },
  { sub: 'kpop', q: 'Como se chama o fandom do BTS?', a: 'ARMY', w: ['BLINK', 'ONCE', 'CARAT'], fact: 'BLINK, ONCE e CARAT são os fãs de BLACKPINK, TWICE e SEVENTEEN.' },
  { sub: 'kpop', q: 'Rosé, do BLACKPINK, lançou qual hit com Bruno Mars em 2024?', a: 'APT.', w: ['Die With a Smile', 'Flower', 'Money'], fact: 'O título vem de um jogo de bebida popular entre jovens coreanos.' },
  { sub: 'kpop', q: 'Qual grupo feminino lançou o hit "Super Shy" (2023)?', a: 'NewJeans', w: ['IVE', 'aespa', 'LE SSERAFIM'], fact: 'O NewJeans estreou em 2022 e virou fenômeno logo no primeiro ano.' },
  { sub: 'kpop', q: 'Qual empresa criou e lançou o BTS?', a: 'Big Hit (hoje HYBE)', w: ['SM Entertainment', 'YG Entertainment', 'JYP Entertainment'], fact: 'Com o sucesso do BTS, a Big Hit cresceu e virou o conglomerado HYBE.' },
  { sub: 'kpop', q: 'Quem é o líder do BTS?', a: 'RM', w: ['Jin', 'Suga', 'Jungkook'], fact: 'RM aprendeu inglês assistindo à série Friends.' },
  { sub: 'kpop', q: 'Qual grupo feminino lançou "Next Level" e tem avatares virtuais no conceito?', a: 'aespa', w: ['ITZY', 'Red Velvet', '(G)I-DLE'], fact: 'Cada integrante do aespa tem uma versão virtual chamada "ae".' },

  // ===== METAL =====
  { sub: 'metal', q: 'Qual vocalista do Black Sabbath ficou conhecido como "Príncipe das Trevas"?', a: 'Ozzy Osbourne', w: ['Ronnie James Dio', 'Bruce Dickinson', 'Rob Halford'], fact: 'Ozzy morreu em julho de 2025, poucas semanas após seu show de despedida.' },
  { sub: 'metal', q: 'Qual banda brasileira foi fundada pelos irmãos Max e Iggor Cavalera?', a: 'Sepultura', w: ['Angra', 'Krisiun', 'Ratos de Porão'], fact: 'O Sepultura surgiu em Belo Horizonte, em 1984.' },
  { sub: 'metal', q: 'Qual banda gravou "Enter Sandman"?', a: 'Metallica', w: ['Megadeth', 'Slayer', 'Anthrax'], fact: 'A música abre o "Black Album", de 1991.' },
  { sub: 'metal', q: 'Qual é o nome do mascote do Iron Maiden?', a: 'Eddie', w: ['Vic Rattlehead', 'Snaggletooth', 'Deathbat'], fact: 'Eddie aparece em praticamente todas as capas de disco da banda.' },
  { sub: 'metal', q: 'Dave Mustaine foi expulso de qual banda antes de fundar o Megadeth?', a: 'Metallica', w: ['Slayer', 'Anthrax', 'Exodus'], fact: 'Ele foi demitido em 1983 e substituído por Kirk Hammett.' },
  { sub: 'metal', q: 'Qual banda alemã canta em alemão e é famosa pelos shows com fogo?', a: 'Rammstein', w: ['Scorpions', 'Accept', 'Kreator'], fact: 'O vocalista Till Lindemann tem licença oficial de pirotécnico.' },
  { sub: 'metal', q: 'O cantor André Matos ficou famoso como vocalista de qual banda?', a: 'Angra', w: ['Sepultura', 'Krisiun', 'Korzus'], fact: 'O Angra mistura heavy metal com música clássica e ritmos brasileiros.' },
  { sub: 'metal', q: 'Além de cantor do Iron Maiden, Bruce Dickinson também é:', a: 'Piloto de avião', w: ['Médico cirurgião', 'Professor de química', 'Chef de cozinha'], fact: 'Ele pilotou o jato da banda, apelidado de "Ed Force One".' },
  { sub: 'metal', q: 'Lemmy Kilmister foi o líder de qual banda?', a: 'Motörhead', w: ['Venom', 'Saxon', 'Judas Priest'], fact: 'O hino da banda é "Ace of Spades", de 1980.' },
  { sub: 'metal', q: 'Rob Halford, o "Metal God", é vocalista de qual banda?', a: 'Judas Priest', w: ['Saxon', 'Dio', 'Manowar'], fact: 'O Judas Priest popularizou o visual de couro e tachas no metal.' },

  // ===== MPB =====
  { sub: 'mpb', q: 'Qual cantora era conhecida pelo apelido de "Pimentinha"?', a: 'Elis Regina', w: ['Gal Costa', 'Maria Bethânia', 'Nara Leão'], fact: 'O apelido foi dado por Vinicius de Moraes, por causa do temperamento dela.' },
  { sub: 'mpb', q: 'Caetano Veloso é irmão de qual cantora?', a: 'Maria Bethânia', w: ['Gal Costa', 'Elis Regina', 'Marisa Monte'], fact: 'Os dois nasceram em Santo Amaro da Purificação, na Bahia.' },
  { sub: 'mpb', q: 'Quem canta "Aquarela" (1983)?', a: 'Toquinho', w: ['Vinicius de Moraes', 'Chico Buarque', 'Ivan Lins'], fact: 'A música é uma versão de uma canção italiana feita por Toquinho e Maurizio Fabrizio.' },
  { sub: 'mpb', q: 'Qual movimento dos anos 60 foi liderado por Caetano Veloso e Gilberto Gil?', a: 'Tropicália', w: ['Jovem Guarda', 'Bossa Nova', 'Clube da Esquina'], fact: 'O disco-manifesto "Tropicália ou Panis et Circencis" saiu em 1968.' },
  { sub: 'mpb', q: 'Milton Nascimento é um dos nomes centrais de qual movimento?', a: 'Clube da Esquina', w: ['Tropicália', 'Vanguarda Paulista', 'Manguebeat'], fact: 'O nome vem de uma esquina de Belo Horizonte onde os amigos se reuniam.' },
  { sub: 'mpb', q: 'Djavan nasceu em qual estado?', a: 'Alagoas', w: ['Pernambuco', 'Bahia', 'Sergipe'], fact: 'Djavan é de Maceió e lançou seu primeiro disco em 1976.' },
  { sub: 'mpb', q: 'Gilberto Gil foi ministro de qual pasta no governo federal?', a: 'Cultura', w: ['Educação', 'Meio Ambiente', 'Turismo'], fact: 'Gil foi Ministro da Cultura de 2003 a 2008.' },
  { sub: 'mpb', q: 'Qual trio é formado por Marisa Monte, Arnaldo Antunes e Carlinhos Brown?', a: 'Tribalistas', w: ['Novos Baianos', 'Doces Bárbaros', 'Quarteto em Cy'], fact: 'O primeiro disco do trio, de 2002, tem o sucesso "Já Sei Namorar".' },
  { sub: 'mpb', q: 'Qual cantor e compositor lançou o álbum "Construção" (1971)?', a: 'Chico Buarque', w: ['Caetano Veloso', 'Gilberto Gil', 'Milton Nascimento'], fact: 'A faixa-título tem versos que terminam sempre em palavras proparoxítonas.' },
  { sub: 'mpb', q: 'Ney Matogrosso ficou famoso nos anos 70 em qual grupo?', a: 'Secos & Molhados', w: ['Os Mutantes', 'Novos Baianos', 'Joelho de Porco'], fact: 'O grupo chamava atenção pelos rostos pintados e figurinos ousados.' },

  // ===== SERTANEJO =====
  { sub: 'sertanejo', q: 'Zezé di Camargo faz dupla com qual irmão?', a: 'Luciano', w: ['Leonardo', 'Bruno', 'Marrone'], fact: 'A história da dupla virou o filme "2 Filhos de Francisco" (2005).' },
  { sub: 'sertanejo', q: 'Qual cantora ficou conhecida como a "Rainha da Sofrência"?', a: 'Marília Mendonça', w: ['Naiara Azevedo', 'Simone Mendes', 'Paula Fernandes'], fact: 'Marília morreu em 2021, aos 26 anos, em um acidente aéreo.' },
  { sub: 'sertanejo', q: 'Leonardo fez sucesso em dupla com qual irmão?', a: 'Leandro', w: ['Luciano', 'Marrone', 'Xororó'], fact: 'Leandro morreu em 1998, e Leonardo seguiu em carreira solo.' },
  { sub: 'sertanejo', q: 'Qual dupla gravou o clássico "Evidências" (1990)?', a: 'Chitãozinho & Xororó', w: ['Zezé di Camargo & Luciano', 'Leandro & Leonardo', 'Milionário & José Rico'], fact: 'A música foi composta por José Augusto e Paulo Sérgio Valle.' },
  { sub: 'sertanejo', q: 'Quem fez sucesso mundial com "Ai Se Eu Te Pego"?', a: 'Michel Teló', w: ['Luan Santana', 'Gusttavo Lima', 'Lucas Lucco'], fact: 'Até Cristiano Ronaldo comemorou gol com a dancinha da música.' },
  { sub: 'sertanejo', q: 'Qual é o apelido do cantor Gusttavo Lima?', a: 'Embaixador', w: ['Fenômeno', 'Boiadeiro', 'Imperador'], fact: 'O apelido também virou nome de suas turnês e shows.' },
  { sub: 'sertanejo', q: 'Simone Mendes fazia dupla com qual irmã?', a: 'Simaria', w: ['Maiara', 'Maraisa', 'Mayra'], fact: 'Simone & Simaria são baianas e encerraram a dupla em 2022.' },
  { sub: 'sertanejo', q: 'A dupla Jorge & Mateus é de qual estado?', a: 'Goiás', w: ['Minas Gerais', 'Mato Grosso do Sul', 'Paraná'], fact: 'Os dois são de Itumbiara, no sul de Goiás.' },
  { sub: 'sertanejo', q: 'Qual dupla caipira ficou conhecida como "A Dupla Coração do Brasil"?', a: 'Tonico & Tinoco', w: ['Pena Branca & Xavantinho', 'Tião Carreiro & Pardinho', 'Milionário & José Rico'], fact: 'Tonico e Tinoco eram irmãos e formaram uma das duplas mais longevas da música caipira.' },
  { sub: 'sertanejo', q: 'Com qual música Luan Santana estourou no Brasil em 2009?', a: 'Meteoro', w: ['Sinais', 'Química do Amor', 'Te Vivo'], fact: 'Luan tinha só 18 anos quando "Meteoro" tomou conta das rádios.' },

  // ===== BREGA =====
  { sub: 'brega', q: 'Qual cantor pernambucano ficou conhecido como o "Rei do Brega"?', a: 'Reginaldo Rossi', w: ['Odair José', 'Amado Batista', 'Wando'], fact: 'Seu maior sucesso é "Garçom", sobre um homem desabafando no bar.' },
  { sub: 'brega', q: 'O que as fãs de Wando costumavam jogar no palco?', a: 'Calcinhas', w: ['Rosas vermelhas', 'Ursinhos de pelúcia', 'Chaveiros'], fact: 'Wando guardava as peças e dizia ter uma coleção enorme.' },
  { sub: 'brega', q: 'Reginaldo Rossi nasceu em qual cidade?', a: 'Recife', w: ['Fortaleza', 'Salvador', 'Belém'], fact: 'Antes do brega, Reginaldo Rossi começou cantando rock nos anos 60.' },
  { sub: 'brega', q: 'Qual apelido o cantor Odair José ganhou nos anos 70?', a: 'Terror das Empregadas', w: ['Príncipe da Seresta', 'Galã do Rádio', 'Cowboy do Amor'], fact: 'O apelido veio de músicas que falavam de amores com empregadas domésticas.' },
  { sub: 'brega', q: 'Qual música de Odair José foi censurada na ditadura?', a: 'Pare de Tomar a Pílula', w: ['Eu Vou Tirar Você Desse Lugar', 'Garçom', 'Fogo e Paixão'], fact: 'A canção falava de anticoncepcional, tema delicado para a censura da época.' },
  { sub: 'brega', q: 'Quem gravou o sucesso brega "Fogo e Paixão"?', a: 'Wando', w: ['Reginaldo Rossi', 'Amado Batista', 'Odair José'], fact: 'Wando foi um dos cantores mais populares do brega romântico nos anos 80.' },
  { sub: 'brega', q: 'Qual cantora paraense ficou famosa à frente da Banda Calypso?', a: 'Joelma', w: ['Gaby Amarantos', 'Fafá de Belém', 'Viviane Batidão'], fact: 'A Calypso vendia milhões de discos de forma independente.' },
  { sub: 'brega', q: 'Qual cantora paraense ganhou o apelido de "Beyoncé do Pará"?', a: 'Gaby Amarantos', w: ['Joelma', 'Viviane Batidão', 'Fafá de Belém'], fact: 'Ela ficou conhecida nacionalmente com "Ex Mai Love", tema de novela.' },
  { sub: 'brega', q: 'Qual era a função de Chimbinha na Banda Calypso?', a: 'Guitarrista', w: ['Baterista', 'Tecladista', 'Baixista'], fact: 'Seu jeito de tocar guitarra virou marca registrada do brega paraense.' },
  { sub: 'brega', q: 'Em qual cidade nasceu o tecnobrega?', a: 'Belém', w: ['Recife', 'Manaus', 'São Luís'], fact: 'O ritmo cresceu com as festas de aparelhagem e a venda de CDs nas ruas.' },

  // ===== DANCE =====
  { sub: 'dance', q: 'Quem canta o clássico dance "What Is Love" (1993)?', a: 'Haddaway', w: ['Dr. Alban', 'Corona', 'Ice MC'], fact: 'Voltou a bombar em 1998 com o filme "A Night at the Roxbury".' },
  { sub: 'dance', q: 'Qual grupo gravou "Blue (Da Ba Dee)"?', a: 'Eiffel 65', w: ['Vengaboys', 'Aqua', 'Daft Punk'], fact: 'O clipe tem tudo em azul, inclusive os integrantes.' },
  { sub: 'dance', q: 'Qual grupo gravou "Barbie Girl" (1997)?', a: 'Aqua', w: ['Vengaboys', 'Eiffel 65', 'Whigfield'], fact: 'A Mattel, fabricante da Barbie, processou a gravadora da banda, mas perdeu na Justiça.' },
  { sub: 'dance', q: 'O grupo Eiffel 65 é de qual país?', a: 'Itália', w: ['França', 'Bélgica', 'Alemanha'], fact: 'Apesar do nome, o grupo é de Turim, na Itália.' },
  { sub: 'dance', q: 'Qual grupo gravou "Rhythm Is a Dancer" (1992)?', a: 'Snap!', w: ['2 Unlimited', 'Culture Beat', 'La Bouche'], fact: 'O Snap! também estourou antes com "The Power", de 1990.' },
  { sub: 'dance', q: 'Qual dupla holandesa gravou "No Limit" (1993)?', a: '2 Unlimited', w: ['Snap!', 'Real McCoy', 'Technotronic'], fact: 'O refrão quase sem palavras ajudou o hit a tocar no mundo todo.' },
  { sub: 'dance', q: 'Qual grupo gravou "Mr. Vain" (1993)?', a: 'Culture Beat', w: ['Masterboy', 'Captain Hollywood Project', 'Cappella'], fact: 'O Culture Beat era alemão e "Mr. Vain" chegou ao 1º lugar em vários países.' },
  { sub: 'dance', q: 'Qual grupo belga gravou "Pump Up the Jam" (1989)?', a: 'Technotronic', w: ['Black Box', 'C+C Music Factory', 'Snap!'], fact: 'A modelo do clipe dublava a voz da verdadeira cantora, Ya Kid K.' },
  { sub: 'dance', q: 'Qual projeto dance gravou "The Rhythm of the Night"?', a: 'Corona', w: ['Cappella', 'Ice MC', 'Fun Factory'], fact: 'O rosto do Corona era a brasileira Olga de Souza.' },
  { sub: 'dance', q: 'Qual grupo gravou "We\'re Going to Ibiza!"?', a: 'Vengaboys', w: ['Aqua', 'Whigfield', 'Scooter'], fact: 'Os Vengaboys são holandeses e também cantam "Boom, Boom, Boom, Boom!!".' },

  // ===== DISCO =====
  { sub: 'disco', q: 'Qual grupo gravou "Stayin\' Alive"?', a: 'Bee Gees', w: ['ABBA', 'Village People', 'Earth, Wind & Fire'], fact: 'A música é da trilha de "Os Embalos de Sábado à Noite" (1977).' },
  { sub: 'disco', q: 'Qual grupo gravou "Y.M.C.A."?', a: 'Village People', w: ['Bee Gees', 'KC and the Sunshine Band', 'Boney M.'], fact: 'A coreografia com os braços formando as letras virou febre nas festas.' },
  { sub: 'disco', q: 'Quem canta o hino disco "I Will Survive"?', a: 'Gloria Gaynor', w: ['Donna Summer', 'Diana Ross', 'Chaka Khan'], fact: 'A música foi lançada em 1978 e ganhou o Grammy.' },
  { sub: 'disco', q: 'Qual cantora ficou conhecida como a "Rainha da Disco"?', a: 'Donna Summer', w: ['Chaka Khan', 'Diana Ross', 'Grace Jones'], fact: 'Donna Summer estourou com "Love to Love You Baby" e "Hot Stuff".' },
  { sub: 'disco', q: 'Qual ator protagonizou "Os Embalos de Sábado à Noite" (1977)?', a: 'John Travolta', w: ['Patrick Swayze', 'Richard Gere', 'Kevin Bacon'], fact: 'O terno branco de Travolta virou símbolo da era disco.' },
  { sub: 'disco', q: 'O grupo ABBA é de qual país?', a: 'Suécia', w: ['Noruega', 'Dinamarca', 'Holanda'], fact: 'O ABBA venceu o Eurovision de 1974 com "Waterloo".' },
  { sub: 'disco', q: 'Qual grupo gravou "Le Freak" (1978)?', a: 'Chic', w: ['Sister Sledge', 'KC and the Sunshine Band', 'Kool & the Gang'], fact: 'O Chic era liderado pelo guitarrista e produtor Nile Rodgers.' },
  { sub: 'disco', q: 'Qual grupo gravou "Rasputin" e "Daddy Cool"?', a: 'Boney M.', w: ['Village People', 'Baccara', 'Arabesque'], fact: 'O Boney M. foi criado na Alemanha pelo produtor Frank Farian.' },
  { sub: 'disco', q: 'Qual era a lendária discoteca de Nova York frequentada por famosos nos anos 70?', a: 'Studio 54', w: ['Studio 45', 'Club 33', 'Palace 88'], fact: 'Andy Warhol, Liza Minnelli e Mick Jagger eram frequentadores.' },
  { sub: 'disco', q: 'Qual grupo brasileiro gravou "Dancin\' Days", tema da novela de 1978?', a: 'As Frenéticas', w: ['As Melindrosas', 'Trio Esperança', 'Quarteto em Cy'], fact: 'A novela "Dancin\' Days" levou a febre das discotecas para todo o Brasil.' },

  // ===== ANOS 80 =====
  { sub: 'anos80', q: 'A banda a-ha, de "Take On Me", é de qual país?', a: 'Noruega', w: ['Suécia', 'Dinamarca', 'Finlândia'], fact: 'O clipe, que mistura desenho e filmagem real, é um dos mais famosos da MTV.' },
  { sub: 'anos80', q: 'Qual apresentadora lançou o sucesso "Ilariê" em 1988?', a: 'Xuxa', w: ['Angélica', 'Mara Maravilha', 'Eliana'], fact: 'Os discos "Xou da Xuxa" venderam milhões de cópias no Brasil.' },
  { sub: 'anos80', q: 'Qual banda gravou "Livin\' on a Prayer" (1986)?', a: 'Bon Jovi', w: ['Def Leppard', 'Journey', 'Europe'], fact: 'Está no álbum "Slippery When Wet", um dos mais vendidos dos anos 80.' },
  { sub: 'anos80', q: 'Qual banda sueca gravou "The Final Countdown" (1986)?', a: 'Europe', w: ['Scorpions', 'Survivor', 'Roxette'], fact: 'O riff de teclado virou trilha clássica de estádios e competições.' },
  { sub: 'anos80', q: 'Qual dupla gravou "Sweet Dreams (Are Made of This)" (1983)?', a: 'Eurythmics', w: ['Pet Shop Boys', 'Tears for Fears', 'Soft Cell'], fact: 'A vocalista Annie Lennox chamou atenção com o cabelo laranja curtinho.' },
  { sub: 'anos80', q: 'Qual banda brasileira gravou "Ursinho Blau-Blau" (1983)?', a: 'Absyntho', w: ['Kid Abelha', 'Ultraje a Rigor', 'Magazine'], fact: 'A música foi um dos maiores sucessos da New Wave brasileira.' },
  { sub: 'anos80', q: 'Em que ano aconteceu a primeira edição do Rock in Rio?', a: '1985', w: ['1980', '1988', '1990'], fact: 'Queen, AC/DC e Iron Maiden tocaram na Cidade do Rock em janeiro de 1985.' },
  { sub: 'anos80', q: 'Quem era a vocalista do Kid Abelha?', a: 'Paula Toller', w: ['Marina Lima', 'Fernanda Abreu', 'Rita Lee'], fact: 'O Kid Abelha emplacou hits como "Como Eu Quero" e "Fixação".' },
  { sub: 'anos80', q: 'Quem canta "Girls Just Want to Have Fun" (1983)?', a: 'Cyndi Lauper', w: ['Madonna', 'Pat Benatar', 'Debbie Harry'], fact: 'Cyndi Lauper também gravou o sucesso "Time After Time".' },
  { sub: 'anos80', q: 'Qual cantor fez sucesso com "Menina Veneno" (1983)?', a: 'Ritchie', w: ['Lulu Santos', 'Lobão', 'Marcelo Nova'], fact: 'Ritchie nasceu na Inglaterra e se mudou para o Brasil nos anos 70.' },

  // ===== ANOS 2000 =====
  { sub: 'anos2000', q: 'Qual cantora lançou o hit "Toxic" (2004)?', a: 'Britney Spears', w: ['Christina Aguilera', 'Jessica Simpson', 'Avril Lavigne'], fact: 'Com "Toxic", Britney ganhou seu primeiro Grammy.' },
  { sub: 'anos2000', q: 'Qual cantora gravou "Hips Don\'t Lie" (2006)?', a: 'Shakira', w: ['Jennifer Lopez', 'Beyoncé', 'Nelly Furtado'], fact: 'A música tem participação do rapper haitiano Wyclef Jean.' },
  { sub: 'anos2000', q: 'Qual banda gravou "In the End", do álbum "Hybrid Theory" (2000)?', a: 'Linkin Park', w: ['Evanescence', 'Limp Bizkit', 'Papa Roach'], fact: '"Hybrid Theory" é um dos álbuns de estreia mais vendidos do século.' },
  { sub: 'anos2000', q: 'Qual cantora canadense estourou com "Complicated" (2002)?', a: 'Avril Lavigne', w: ['Kelly Clarkson', 'Michelle Branch', 'Alanis Morissette'], fact: 'A gravata com regata virou o visual marcante de Avril na época.' },
  { sub: 'anos2000', q: 'Qual grupo feminino nasceu do reality "Popstars" em 2002?', a: 'Rouge', w: ['KLB', 'Twister', 'Banda Calypso'], fact: 'O Rouge estourou com "Ragatanga", versão de "Aserejé".' },
  { sub: 'anos2000', q: 'Qual banda brasileira fez sucesso com "Razões e Emoções" (2006)?', a: 'NX Zero', w: ['Fresno', 'CPM 22', 'Strike'], fact: 'O NX Zero foi um dos símbolos da onda emo no Brasil.' },
  { sub: 'anos2000', q: 'Qual dupla gravou "Hey Ya!" (2003)?', a: 'OutKast', w: ['The Black Eyed Peas', 'Daft Punk', 'N.E.R.D'], fact: 'No clipe, André 3000 interpreta todos os integrantes da banda.' },
  { sub: 'anos2000', q: 'Quem canta "Rehab" (2006)?', a: 'Amy Winehouse', w: ['Adele', 'Duffy', 'Lily Allen'], fact: 'A música está no álbum "Back to Black" e ganhou três Grammys.' },
  { sub: 'anos2000', q: '"Crazy" (2006) foi o grande hit de qual dupla?', a: 'Gnarls Barkley', w: ['The White Stripes', 'MGMT', 'Daft Punk'], fact: 'A dupla é formada por CeeLo Green e o produtor Danger Mouse.' },
  { sub: 'anos2000', q: 'Qual cantor gravou "Festa no Apê" (2004)?', a: 'Latino', w: ['Felipe Dylon', 'MC Créu', 'Rodriguinho'], fact: 'É uma versão de "Dragostea Din Tei", do grupo moldavo O-Zone.' },

  // ===== ROCK (extra) =====
  { sub: 'rock', q: 'Quem é o baixista dos Paralamas do Sucesso?', a: 'Bi Ribeiro', w: ['João Barone', 'Charles Gavin', 'Dado Villa-Lobos'], fact: 'Herbert Vianna, Bi Ribeiro e João Barone formam o trio desde 1982.' },
  { sub: 'rock', q: 'Qual baterista foi substituído por Ringo Starr nos Beatles, em 1962?', a: 'Pete Best', w: ['Stuart Sutcliffe', 'Brian Epstein', 'George Martin'], fact: 'Quem comunicou a demissão foi o empresário da banda, Brian Epstein.' },
  { sub: 'rock', q: 'Qual guitarrista compôs "Stairway to Heaven" (1971) com Robert Plant?', a: 'Jimmy Page', w: ['Jeff Beck', 'Eric Clapton', 'John Paul Jones'], fact: 'A música está no 4º álbum do Led Zeppelin, que não tem título oficial.' },
  { sub: 'rock', q: 'Rita Lee começou a carreira em qual banda dos anos 60?', a: 'Os Mutantes', w: ['Secos & Molhados', 'Novos Baianos', 'Made in Brazil'], fact: 'Chamada de "Rainha do Rock brasileiro", Rita Lee morreu em 2023, aos 75 anos.' },
  { sub: 'rock', q: 'Qual é o nome verdadeiro de Bono, vocalista do U2?', a: 'Paul Hewson', w: ['David Evans', 'Adam Clayton', 'Larry Mullen'], fact: 'O guitarrista The Edge, por sua vez, se chama David Evans.' },

  // ===== POP (extra) =====
  { sub: 'pop', q: 'Qual é o nome do irmão e produtor de Billie Eilish?', a: 'Finneas', w: ['Jack Antonoff', 'Benny Blanco', 'Max Martin'], fact: 'Os dois já ganharam dois Oscars de Canção Original, por 007 e por "Barbie".' },
  { sub: 'pop', q: 'O que os nomes dos álbuns de Adele (19, 21, 25, 30) indicam?', a: 'A idade dela na época', w: ['O ano de lançamento', 'O número de faixas', 'O dia do aniversário'], fact: '"21" foi o álbum mais vendido do mundo em 2011 e também em 2012.' },
  { sub: 'pop', q: 'Em qual álbum de The Weeknd está "Blinding Lights" (2019)?', a: 'After Hours', w: ['Starboy', 'Dawn FM', 'Beauty Behind the Madness'], fact: 'Em 2021, a Billboard a elegeu a maior música da história da Hot 100.' },
  { sub: 'pop', q: 'Ariana Grande ficou famosa na TV em qual série da Nickelodeon?', a: 'Brilhante Victória', w: ['iCarly', 'Drake & Josh', 'Zoey 101'], fact: 'Na série, ela interpretava a ruivinha Cat Valentine.' },
  { sub: 'pop', q: 'Qual sucesso de Whitney Houston é a regravação de uma música de Dolly Parton?', a: 'I Will Always Love You', w: ['I Wanna Dance with Somebody', 'Greatest Love of All', 'How Will I Know'], fact: 'A versão de Whitney é da trilha do filme "O Guarda-Costas" (1992).' },

  // ===== K-POP (extra) =====
  { sub: 'kpop', q: 'Qual integrante do BTS foi o primeiro a se alistar no serviço militar, em 2022?', a: 'Jin', w: ['Suga', 'J-Hope', 'Jungkook'], fact: 'Jin é o mais velho do grupo. Os sete concluíram o serviço até 2025.' },
  { sub: 'kpop', q: 'Qual grupo fictício canta "Golden" na animação "Guerreiras do K-Pop" (2025)?', a: 'HUNTR/X', w: ['Saja Boys', 'BLACKPINK', 'TWICE'], fact: '"Golden" chegou ao 1º lugar da Billboard Hot 100. Os Saja Boys são os rivais do filme.' },
  { sub: 'kpop', q: 'Qual grupo feminino lançou os hits "TT" e "Fancy"?', a: 'TWICE', w: ['Red Velvet', 'ITZY', 'MAMAMOO'], fact: 'O TWICE nasceu do reality show "Sixteen", da JYP, em 2015.' },
  { sub: 'kpop', q: 'Qual hit do BIGBANG, de 2012, virou um dos maiores hinos do K-pop?', a: 'Fantastic Baby', w: ['Growl', 'Lucifer', 'Sherlock'], fact: 'O líder G-Dragon é também o principal compositor do grupo.' },
  { sub: 'kpop', q: 'Qual grupo de K-pop tem 13 integrantes divididos em três unidades?', a: 'SEVENTEEN', w: ['NCT 127', 'Stray Kids', 'TREASURE'], fact: 'O nome vem da conta: 13 membros + 3 unidades + 1 grupo = 17.' },

  // ===== METAL (extra) =====
  { sub: 'metal', q: 'Quem é o vocalista do Slipknot, que também canta no Stone Sour?', a: 'Corey Taylor', w: ['Chester Bennington', 'Serj Tankian', 'Jonathan Davis'], fact: 'Os integrantes mascarados do Slipknot já foram numerados de 0 a 8.' },
  { sub: 'metal', q: 'Ronnie James Dio substituiu Ozzy Osbourne em qual banda, em 1979?', a: 'Black Sabbath', w: ['Rainbow', 'Deep Purple', 'Judas Priest'], fact: 'Dio ajudou a popularizar no metal o gesto dos "chifrinhos" com a mão.' },
  { sub: 'metal', q: 'Qual banda finlandesa de monstros venceu o Eurovision em 2006?', a: 'Lordi', w: ['Nightwish', 'HIM', 'Children of Bodom'], fact: 'A música vencedora foi "Hard Rock Hallelujah".' },
  { sub: 'metal', q: 'Qual álbum do System of a Down, de 2001, traz "Chop Suey!"?', a: 'Toxicity', w: ['Mezmerize', 'Hypnotize', 'Steal This Album!'], fact: 'Todos os integrantes da banda são descendentes de armênios.' },
  { sub: 'metal', q: 'O guitarrista Dimebag Darrell ficou famoso em qual banda?', a: 'Pantera', w: ['Slayer', 'Testament', 'Machine Head'], fact: 'Dimebag foi morto a tiros em cima do palco, durante um show, em 2004.' },

  // ===== MPB (extra) =====
  { sub: 'mpb', q: 'Quem foi a musa que inspirou "Garota de Ipanema"?', a: 'Helô Pinheiro', w: ['Nara Leão', 'Leila Diniz', 'Danuza Leão'], fact: 'Tom e Vinicius a viam passar do bar Veloso, hoje chamado Garota de Ipanema.' },
  { sub: 'mpb', q: 'Qual cantor gravou os discos "Racional" na fase em que entrou para uma seita?', a: 'Tim Maia', w: ['Cassiano', 'Hyldon', 'Wilson Simonal'], fact: 'Depois de romper com a seita, Tim Maia renegou esses discos.' },
  { sub: 'mpb', q: 'Quem compôs "Como Nossos Pais", eternizada na voz de Elis Regina?', a: 'Belchior', w: ['Fagner', 'Ednardo', 'Raul Seixas'], fact: 'O cearense Belchior também gravou a canção no disco "Alucinação" (1976).' },
  { sub: 'mpb', q: 'Qual cantora fez sucesso com "Festa do Interior" (1981)?', a: 'Gal Costa', w: ['Maria Bethânia', 'Simone', 'Elba Ramalho'], fact: 'Gal Costa morreu em 2022, aos 77 anos.' },
  { sub: 'mpb', q: 'Quem compôs "Mas Que Nada", que estourou no mundo com Sérgio Mendes?', a: 'Jorge Ben Jor', w: ['Wilson Simonal', 'Carlos Lyra', 'João Donato'], fact: 'Jorge Ben lançou a música no seu 1º disco, "Samba Esquema Novo" (1963).' },

  // ===== SERTANEJO (extra) =====
  { sub: 'sertanejo', q: 'Qual era o nome do projeto de Marília Mendonça com Maiara & Maraisa?', a: 'Patroas', w: ['Poderosas', 'Rainhas', 'Sofredoras'], fact: 'As gêmeas Maiara e Maraisa eram grandes amigas e parceiras de Marília.' },
  { sub: 'sertanejo', q: 'Quem compôs "Tocando em Frente" em parceria com Renato Teixeira?', a: 'Almir Sater', w: ['Sérgio Reis', 'Rolando Boldrin', 'Tião Carreiro'], fact: 'O violeiro Almir Sater também atuou na novela "Pantanal" (1990).' },
  { sub: 'sertanejo', q: 'Qual dupla de irmãos fez sucesso com "Borboletas" (2008)?', a: 'Victor & Leo', w: ['Jorge & Mateus', 'César Menotti & Fabiano', 'João Neto & Frederico'], fact: 'A dupla também emplacou "Fada" e "Amigo Apaixonado".' },
  { sub: 'sertanejo', q: 'Qual cantora é chamada de "Boiadeira" e estourou com "Pipoco" (2022)?', a: 'Ana Castela', w: ['Lauana Prado', 'Yasmin Santos', 'Naiara Azevedo'], fact: '"Pipoco" foi gravada com Melody e DJ Chris no Beat.' },
  { sub: 'sertanejo', q: 'Qual dupla ficou conhecida como "As Gargantas de Ouro do Brasil"?', a: 'Milionário & José Rico', w: ['Tião Carreiro & Pardinho', 'Pena Branca & Xavantinho', 'Zilo & Zalo'], fact: 'Seu maior sucesso, "Estrada da Vida", virou filme no começo dos anos 80.' },

  // ===== BREGA (extra) =====
  { sub: 'brega', q: 'Qual música de Sidney Magal dá nome à cinebiografia dele, de 2023?', a: 'Meu Sangue Ferve por Você', w: ['Sandra Rosa Madalena', 'Me Chama Que Eu Vou', 'Amante Latino'], fact: 'O filme conta o romance de Magal com Magali, sua mulher por décadas.' },
  { sub: 'brega', q: 'Quem gravou o sucesso "Fuscão Preto"?', a: 'Almir Rogério', w: ['Bartô Galeno', 'Fernando Mendes', 'Sidney Magal'], fact: 'A música virou filme em 1983, estrelado por Xuxa.' },
  { sub: 'brega', q: 'Qual cantor gravou o clássico "Eu Não Sou Cachorro, Não"?', a: 'Waldick Soriano', w: ['Agnaldo Timóteo', 'Nelson Ned', 'Paulo Sérgio'], fact: 'Baiano, Waldick se apresentava sempre de chapéu e óculos escuros.' },
  { sub: 'brega', q: 'Qual cantor brega gravou "O Fruto do Nosso Amor" e "Princesa"?', a: 'Amado Batista', w: ['Odair José', 'Bartô Galeno', 'Fernando Mendes'], fact: 'Goiano, Amado Batista é um dos maiores vendedores de discos do Brasil.' },
  { sub: 'brega', q: 'Qual cantor, apelidado de "O Ídolo Negro", gravou "Sorria, Sorria"?', a: 'Evaldo Braga', w: ['Agnaldo Timóteo', 'Waldick Soriano', 'Nelson Ned'], fact: 'Evaldo Braga morreu em um acidente de carro em 1973, aos 25 anos.' },

  // ===== DANCE (extra) =====
  { sub: 'dance', q: 'Qual dupla de produtores fez o remix de "Macarena" que estourou no mundo?', a: 'Bayside Boys', w: ['Black Box', 'C+C Music Factory', 'The KLF'], fact: 'A música original é da dupla espanhola Los del Río.' },
  { sub: 'dance', q: 'Qual grupo alemão gravou "Coco Jambo" (1996)?', a: 'Mr. President', w: ['Fun Factory', 'Masterboy', 'E-Rotic'], fact: 'O trio virou presença certa nas festas e programas de TV dos anos 90.' },
  { sub: 'dance', q: 'Qual cantor transformou a própria gagueira no hit "Scatman" (1994)?', a: 'Scatman John', w: ['Dr. Alban', 'Haddaway', 'Ice MC'], fact: 'Ele usava o "scat", improviso vocal do jazz, para driblar a gagueira.' },
  { sub: 'dance', q: 'Qual cantora italiana gravou "Freed from Desire" (1996)?', a: 'Gala', w: ['Alexia', 'Whigfield', 'Ann Lee'], fact: 'Em 2016, a música virou canto de torcida no futebol europeu.' },
  { sub: 'dance', q: 'Qual DJ gravou o clássico instrumental "Children" (1995)?', a: 'Robert Miles', w: ['Gigi D\'Agostino', 'Benny Benassi', 'Paul van Dyk'], fact: 'A faixa calma foi feita para acalmar quem voltava dirigindo das raves.' },

  // ===== DISCO (extra) =====
  { sub: 'disco', q: 'Quais integrantes do ABBA compunham as músicas do grupo?', a: 'Benny e Björn', w: ['Agnetha e Frida', 'Benny e Agnetha', 'Björn e Frida'], fact: 'O nome ABBA vem das iniciais dos quatro integrantes.' },
  { sub: 'disco', q: 'Qual grupo gravou "September" (1978)?', a: 'Earth, Wind & Fire', w: ['Kool & the Gang', 'The Jacksons', 'Commodores'], fact: 'O dia 21 de setembro, citado na letra, virou data comemorada pelos fãs.' },
  { sub: 'disco', q: 'Qual grupo de irmãs gravou "We Are Family" (1979)?', a: 'Sister Sledge', w: ['The Pointer Sisters', 'The Emotions', 'The Supremes'], fact: 'A música foi composta e produzida por Nile Rodgers e Bernard Edwards, do Chic.' },
  { sub: 'disco', q: 'Qual banda gravou "That\'s the Way (I Like It)" (1975)?', a: 'KC and the Sunshine Band', w: ['Commodores', 'Village People', 'The Ritchie Family'], fact: 'A banda é de Miami, e "KC" é o vocalista Harry Wayne Casey.' },
  { sub: 'disco', q: 'Qual grupo gravou "Disco Inferno", da trilha de "Os Embalos de Sábado à Noite"?', a: 'The Trammps', w: ['Heatwave', 'The Hues Corporation', 'Tavares'], fact: 'O grupo era da Filadélfia, berço do som "Philly Soul".' },

  // ===== ANOS 80 (extra) =====
  { sub: 'anos80', q: 'Quem fazia dupla com George Michael no Wham!?', a: 'Andrew Ridgeley', w: ['Simon Le Bon', 'Tony Hadley', 'Boy George'], fact: '"Wake Me Up Before You Go-Go" (1984) foi o 1º nº 1 da dupla nos EUA.' },
  { sub: 'anos80', q: 'Qual álbum dos Titãs, de 1986, tem "Polícia" e "Homem Primata"?', a: 'Cabeça Dinossauro', w: ['Televisão', 'Õ Blésq Blom', 'Acústico MTV'], fact: 'É apontado como um dos melhores discos da história do rock brasileiro.' },
  { sub: 'anos80', q: 'Qual banda gravou "Você Não Soube Me Amar" (1982)?', a: 'Blitz', w: ['Rádio Táxi', 'Magazine', 'João Penca e Seus Miquinhos'], fact: 'O vocalista Evandro Mesquita depois virou ator de novelas e séries.' },
  { sub: 'anos80', q: 'Qual banda gravou "Don\'t You (Forget About Me)" (1985)?', a: 'Simple Minds', w: ['Tears for Fears', 'Duran Duran', 'The Cure'], fact: 'A música é o tema do filme "Clube dos Cinco" (1985).' },
  { sub: 'anos80', q: 'Qual álbum de Prince, lançado em 1984, também virou filme?', a: 'Purple Rain', w: ['1999', 'Controversy', 'Lovesexy'], fact: 'Prince ganhou o Oscar de Melhor Trilha Sonora Original pelo filme.' },

  // ===== ANOS 2000 (extra) =====
  { sub: 'anos2000', q: 'Qual álbum de 2003 marcou a estreia solo de Beyoncé?', a: 'Dangerously in Love', w: ['B\'Day', 'I Am... Sasha Fierce', 'Lemonade'], fact: 'O disco traz "Crazy in Love", gravada com Jay-Z.' },
  { sub: 'anos2000', q: 'Qual integrante do RBD interpretava Mia Colucci na novela "Rebelde"?', a: 'Anahí', w: ['Dulce María', 'Maite Perroni', 'Belinda'], fact: 'A novela "Rebelde" passou no SBT a partir de 2005.' },
  { sub: 'anos2000', q: 'Qual banda gravou "Mr. Brightside" (2004)?', a: 'The Killers', w: ['The Strokes', 'Franz Ferdinand', 'Kings of Leon'], fact: 'Apesar do som britânico, a banda é de Las Vegas, nos EUA.' },
  { sub: 'anos2000', q: 'Qual cantor gravou "Yeah!" (2004) com Lil Jon e Ludacris?', a: 'Usher', w: ['Ne-Yo', 'Chris Brown', 'Nelly'], fact: 'Foi a música nº 1 da parada anual da Billboard em 2004.' },
  { sub: 'anos2000', q: 'Qual banda gravou "Um Minuto para o Fim do Mundo" (2005)?', a: 'CPM 22', w: ['Fresno', 'Charlie Brown Jr.', 'Detonautas'], fact: 'A música está no álbum "Felicidade Instantânea", de 2005.' },
];

export default questions;
