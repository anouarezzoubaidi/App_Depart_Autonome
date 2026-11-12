import {View,Text,StyleSheet,FlatList} from 'react-native';

type Evenement={
  id:string,
  titre:string,
  categorie:string,
  capacite:number,
  inscrits:number,
}
const evenements:Evenement[]=[
  {id:'E01',titre:'Atelier React',categorie:'Atelier', capacite:25,inscrits:25},
  {id:'E02',titre:'Conference IA',categorie:'Conference',capacite:70,inscrits:52},
  {id:'E03',titre:'Secrurite mobile',categorie:'Atelier',capacite:20,inscrits:17},
  {id:'E04',titre:'Design UI',categorie:'Atelier',capacite:18,inscrits:9},
  {id:'E05',titre:'Forum projets',categorie:'Rencontre',capacite:50,inscrits:49},
  {id:'E06',titre:'Decouverte Git',categorie:'Atelier',capacite:24,inscrits:24}
];

function placesRestantes(e:Evenement):number{
  return Math.max(0,e.capacite - e.inscrits);
   
}
function statutEvenement(e:Evenement):string{
  const r=placesRestantes(e);
  if(r===0){
    return 'Complet'
  }
  else if(r>=1 && r<=3){
    return 'Presque complet'
  }
  else{
    return 'Ouvert'
  }
}

const nombre_total=evenements.length;
const nombre_complets=evenements.filter((e) => statutEvenement(e)==='Complet' ).length;
const evenement_place=evenements.filter((e) => placesRestantes(e)>0).length;
const places=evenements.reduce((somme,e)=> somme + placesRestantes(e),0 );
const ateliers=evenements.filter((e) => e.categorie === 'Atelier' && placesRestantes(e)>0);

type BadgeProps={statut:string};
function BadgeEtat({statut}:BadgeProps){
  let couleur='#D6F5E7';
  if (statut === 'Complet') {
    couleur = '#FFE5E5';
  } else if (statut === 'Presque complet') {
    couleur = '#FFE9CC';
  }
  
  return (
    <View style={[styles.badge, { backgroundColor:couleur }]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

type CartePops={evenement:Evenement};
function CarteEvenement({evenement}:CartePops){
    const {titre,categorie}=evenement;
    const places = placesRestantes(evenement);
    const statut = statutEvenement(evenement)
    return (
    <View style={styles.carte}>
      <View style={styles.entete}>
        <Text style={styles.titre}>{titre}</Text>
        <BadgeEtat statut={statut}/>
      </View>
      <Text style={styles.info}>{categorie}</Text>
      <Text style={styles.info}>{places}</Text>
      
    </View>
    );

}

type BlocProps = { libelle: string; nombre: number };

function BlocStatistique({ libelle, nombre }: BlocProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.libelle}>{libelle}</Text>
    </View>
  );
}

type Mode=string;
const mode:Mode='tous';

export default function App(){
  const liste = mode === 'tous' ? evenements : ateliers;
 
  return(
    <View style={styles.page}>
      <Text style={styles.titreApp}>CampusAgenda</Text>
      <Text style={styles.sousTitre}>Événements du campus</Text>

      <View style={styles.statsRow}>
        <BlocStatistique libelle="Evenements" nombre={nombre_total}/>
        <BlocStatistique libelle="Complets" nombre={nombre_complets}/>
        <BlocStatistique libelle="Avec places" nombre={evenement_place}/>
        <BlocStatistique libelle="Places restantes" nombre={places} />
      </View>

      <Text style={styles.titreMode}>
        {mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles'}
      </Text>

      <FlatList
        data={liste}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={<Text style={styles.vide}>Aucun événement à afficher.</Text>}
      />
    </View>
  );
}
const styles=StyleSheet.create({
  carte: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12 },
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titre: { fontSize: 18, fontWeight: 'bold', flexShrink: 1 },
  info: { marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginLeft: 8 },
  texteBadge: { fontSize: 12, fontWeight: 'bold', color: '#00235C' },
  bloc: { flex: 1, minWidth: 140, padding: 12, borderRadius: 12, backgroundColor: '#DCEBFF', alignItems: 'center' },
  nombre: { fontSize: 22, fontWeight: 'bold', color: '#00235C' },
  libelle: { fontSize: 12, color: '#4C5360', textAlign: 'center' },
  page: { flex: 1, paddingTop: 56, paddingHorizontal: 18, backgroundColor: '#F2F7FD' },
  titreApp: { fontSize: 27, fontWeight: 'bold', color: '#00235C' },
  sousTitre: { color: '#4C5360', marginTop: 4, marginBottom: 16 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  titreMode: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  vide: { textAlign: 'center', color: '#4C5360', marginTop: 20 },
});
