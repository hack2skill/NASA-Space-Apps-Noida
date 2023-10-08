package com.example.geopedia.Fragments

import androidx.fragment.app.Fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.FragmentTransaction
import androidx.navigation.Navigation
import androidx.navigation.fragment.NavHostFragment
import com.example.geopedia.R

import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions
import java.util.Locale

class MapsFragment : Fragment() {

    private val PHOENIX = LatLng(33.4527195589178, -112.05370710089764)
    private val SYDNEY = LatLng(-33.87365, 151.20689)
    private val BRISBANE = LatLng(-27.47093, 153.0235)

    private var markerPhoenix: Marker? = null
    private var markerSydney: Marker? = null
    private var markerBrisbane: Marker? = null

    private val callback = OnMapReadyCallback { googleMap ->
        // Add some markers to the map, and add a data object to each marker.
        googleMap.mapType=GoogleMap.MAP_TYPE_HYBRID
        markerPhoenix = googleMap.addMarker(
            MarkerOptions()
                .position(PHOENIX)
                .title("Phoenix")
        )
        markerPhoenix?.tag = 0
        markerSydney = googleMap.addMarker(
            MarkerOptions()
                .position(SYDNEY)
                .title("Sydney").visible(true)
        )
        markerSydney?.tag = 0
        markerBrisbane = googleMap.addMarker(
            MarkerOptions()
                .position(BRISBANE)
                .title("Brisbane")
        )
        markerBrisbane?.tag = 0
        markerBrisbane?.snippet = SectionFragment().toString()
        /*markerPerth?.let { onMarkerClick(it) }
        markerSydney?.let { onMarkerClick(it) }*/

        googleMap.setOnMarkerClickListener {
            onMarkerClick()
        }
        setMapLongClick(googleMap)
    }

    private fun onMarkerClick(): Boolean {
        // Retrieve the data from the marker.
        /*Navigation.findNavController(requireView()).navigate(R.id.action_mapsFragment_to_sectionFragment2)*/


        val ft: FragmentTransaction = requireFragmentManager().beginTransaction();
        ft.replace(R.id.fragment_container,SectionFragment());
        ft.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE);
        ft.addToBackStack(null)
        ft.commit();

        return true
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_maps, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val mapFragment = childFragmentManager.findFragmentById(R.id.map) as SupportMapFragment?
        mapFragment?.getMapAsync(callback)
    }

    private fun setMapLongClick(map: GoogleMap) {
        map.setOnMapLongClickListener { latLng ->
            // A Snippet is Additional text that's displayed below the title.
            val snippet = String.format(
                Locale.getDefault(),
                "Lat: %1$.5f, Long: %2$.5f",
                latLng.latitude,
                latLng.longitude
            )

            map.addMarker(
                MarkerOptions()
                    .position(latLng)
                    .title("Marked location")
                    .snippet(snippet)
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE))
//                    .draggable(true)
            )
        }
    }


}


