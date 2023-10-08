package com.example.geopedia.Fragments

import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.browser.customtabs.CustomTabsIntent
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.geopedia.Adapters.HomeRVAdapter
import com.example.geopedia.Adapters.newsItemClicked
import com.example.geopedia.Models.HomeCardData
import com.example.geopedia.R
import com.example.geopedia.databinding.FragmentHomeBinding
import com.google.android.material.button.MaterialButton

class HomeFragment : Fragment() {
    lateinit var binding: FragmentHomeBinding
    private lateinit var adapter: HomeRVAdapter
    private lateinit var cardList: ArrayList<HomeCardData>
    private lateinit var recyclerView: RecyclerView

    lateinit var title: Array<String>
    lateinit var subtitle: Array<String>
    lateinit var description: Array<String>
    lateinit var image: Array<Int>
    lateinit var urls: Array<String?>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding = FragmentHomeBinding.inflate(layoutInflater, container, false)


        /*binding.btnExplore.setOnClickListener {
            val url = "https://www.google.com"
            val url1 = "https://ladsweb.modaps.eosdis.nasa.gov/#land"
            val builder = CustomTabsIntent.Builder()
            builder.setToolbarColor(Color.parseColor("#6200EE"))
            val customTabsIntent = builder.build()
            customTabsIntent.launchUrl(requireContext(), Uri.parse(url1))
        }*/

        dataInit()
        val layoutManager = LinearLayoutManager(context)
        recyclerView = binding.recyclerView
        recyclerView.layoutManager = layoutManager
        recyclerView.setHasFixedSize(true)
        adapter = HomeRVAdapter(cardList, object : newsItemClicked {
            override fun OnItemClicked(Item: HomeCardData) {
                val url = Item.url
                val builder = CustomTabsIntent.Builder()
                val customTabsIntent = builder.build()
                customTabsIntent.launchUrl(requireContext(), Uri.parse(url))
            }
        })
        recyclerView.adapter = adapter

        return binding.root

    }

    private fun dataInit() {

        cardList = ArrayList<HomeCardData>()

        title = arrayOf(
            "NASA Earth Data",
            "Ladsweb Data",
            "LAADS DAAC",
            "SAR Data",
            "HLS Data",
            "GRACE Data",
            "GRACE-FO Data",
            "EMIT Data",
            "Hydrogeology",
            )

        description = arrayOf(
            getString(R.string.NasaEarth),
            getString(R.string.Ladsweb),
            getString(R.string.laadsstring),
            getString(R.string.sarstring),
            getString(R.string.HLSstring),
            getString(R.string.gracestring),
            getString(R.string.gracestring),
            getString(R.string.emitstring),
            getString(R.string.sarstring),
            )

        image = arrayOf(
            R.drawable.nasapic,
            R.drawable.laads,
            R.drawable.laads1,
            R.drawable.sar_headernasa,
            R.drawable.bitbucket,
            R.drawable.nasagrace,
            R.drawable.nasagrace2,
            R.drawable.emit,
            R.drawable.geologist,
        )

        urls = arrayOf(
            "https://search.earthdata.nasa.gov/search",
            "https://ladsweb.modaps.eosdis.nasa.gov/view-data/#@87.9,25.4,3.7z",
            "https://ladsweb.modaps.eosdis.nasa.gov/search/",
            "https://appliedsciences.nasa.gov/get-involved/training/english/arset-introduction-synthetic-aperture-radar",
            "https://git.earthdata.nasa.gov/projects/LPDUR/repos/hls-tutorial/browse",
            "https://podaac.jpl.nasa.gov/GRACE",
            "https://grace.jpl.nasa.gov/data/data-analysis-tool/",
            "https://earth.jpl.nasa.gov/emit/data/data-products/",
            "https://git.earthdata.nasa.gov",
        )

        for (i in title.indices) {
            val cardData = HomeCardData(title[i], description[i], image[i], urls[i])
            cardList.add(cardData)
            }
        }
}