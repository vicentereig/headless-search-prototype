import Head from 'next/head';
import {useState} from "react";
import {InformationCircleIcon} from '@heroicons/react/outline'
import HomeSearch from "../components/home-search";


export default function Home() {
    const [article, setArticle] = useState();
  return (
      <div className="mx-auto w-2/3">
          <Head>
            <title>Create Next App</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className="">
            <HomeSearch onSelected={setArticle}/>
              {article && <div className="p-5 rounded-md bg-purple-50 text-purple-400 flex my-5">
                  <InformationCircleIcon className="h-5 w-5 mr-2"/>
                  <p>Now you can do something with <strong>{article.title}</strong></p>
              </div>}

            <div className="text-left">
              <h2 className="pb-4 text-xl">Lorem ipsum dolor sit amet</h2>
              <p className="pb-4 leading-5">Consectetur adipiscing elit. Sed lacinia, libero ac mollis posuere, dui magna ullamcorper urna, vitae pretium ipsum tortor et sapien. Duis laoreet, est eu vestibulum scelerisque, augue elit pretium est, ut tincidunt ipsum risus ac lacus. Suspendisse finibus in sapien non venenatis. Sed vulputate lacinia tempus. In hac habitasse platea dictumst. Nullam mattis, neque non pharetra accumsan, metus justo lobortis magna, posuere efficitur urna libero eu dolor. Fusce elementum nibh auctor mi pretium, sit amet ultricies ligula sodales. Nunc luctus ultricies accumsan.</p>
              <p className="pb-4 leading-5">Pellentesque tincidunt dolor eu nunc tristique, vitae congue massa ultrices. Suspendisse condimentum ligula sed turpis posuere molestie. Proin nibh quam, dapibus ac purus quis, gravida volutpat lorem. Fusce nulla turpis, bibendum eget tortor vitae, tincidunt euismod nisi. Fusce felis leo, feugiat sit amet porttitor ac, sodales a augue. Donec lobortis ante non purus sollicitudin, in rhoncus sapien feugiat. Proin fringilla ipsum metus, ac feugiat elit dapibus at. Maecenas placerat, metus eget luctus mattis, neque libero ullamcorper ex, eu blandit eros mauris vel lacus. Quisque auctor porta lacinia. Morbi nec nisi tristique, efficitur enim ut, porta nisl. Donec est libero, dapibus luctus elementum non, tincidunt non nisi. Integer vitae augue sed lacus rhoncus dignissim. Curabitur dapibus ac lacus eget tincidunt.</p>
              <p className="pb-4 leading-5">Donec magna metus, ultrices vitae nunc eu, sollicitudin convallis arcu. Etiam imperdiet, lectus eget varius lobortis, augue elit ultricies velit, ac pretium felis enim sed neque. Maecenas consequat dui ut vulputate placerat. Cras ut sem lacinia ipsum suscipit egestas sit amet eget ante. Phasellus placerat sed velit a accumsan. Mauris pulvinar pulvinar est eget maximus. Nullam tristique imperdiet magna sed consequat. Nulla pulvinar sit amet justo at ullamcorper. Aliquam ornare dui et urna aliquet, a rhoncus quam iaculis. Praesent ut mattis turpis, in tincidunt nunc. Fusce fringilla arcu quis erat vestibulum pharetra. Integer ut ultrices massa. Phasellus sodales non diam nec dictum. Sed imperdiet pretium sem, sed egestas risus rutrum eget. Aenean finibus, quam eget efficitur ullamcorper, ipsum velit mattis orci, accumsan rutrum lorem massa id ligula. Nunc in dignissim sapien.</p>
              <p className="pb-4 leading-5">Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent dapibus, justo sit amet aliquet maximus, nibh magna ullamcorper sem, vel congue erat risus vel ex. Integer aliquet mollis dolor eget posuere. Integer et efficitur velit. Praesent vestibulum, ipsum sed venenatis cursus, justo sapien elementum arcu, ut eleifend dolor felis a sapien. Duis quis porttitor massa. Phasellus elementum nulla tortor, eget pretium nunc porttitor non. Sed et metus sed nisl gravida porta. Nam feugiat nunc dui, ut convallis massa molestie vitae. Cras metus enim, sagittis dignissim aliquam nec, venenatis in purus. Cras sed ante cursus, semper mi id, semper diam. Fusce sagittis tempor nisi, sit amet aliquam sem commodo pretium. Etiam et interdum odio. Cras eget gravida dui, id gravida lacus.</p>
              <p className="pb-4 leading-5">Etiam vehicula pulvinar posuere. Nulla sollicitudin in quam in pretium. Mauris hendrerit suscipit sollicitudin. Etiam est urna, pulvinar quis risus sed, imperdiet auctor nunc. Pellentesque pharetra cursus libero dignissim semper. Maecenas dapibus imperdiet ligula eu luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce eget rutrum arcu, nec venenatis libero. Vivamus sit amet semper nisi. Maecenas nulla nulla, rhoncus eget dui sed, convallis tincidunt diam. In hac habitasse platea dictumst. Vivamus tincidunt varius pellentesque. Curabitur porta pellentesque tellus, in sodales metus lacinia a. Morbi eu ipsum libero.</p>
            </div>
          </main>
      </div>
  )
}
