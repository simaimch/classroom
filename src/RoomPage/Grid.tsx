import React, { useContext, useMemo, useState } from "react";
import { EPlaceForm, type Place } from "../_types/Place";
import { AccountContext } from "../_contexts/AccountContext";
import Room from "../_types/Room";
import { SetAccount } from "../App";
import Account from "../_types/Account";
import { md5 } from "../_helpers/md5";

const CELL = 32;



export default function Grid({
    roomId,
    margin,
}:{
    roomId: string,
    margin: number,
}) {

    let account = useContext(AccountContext);
    const roomToDisplay = account?.rooms[roomId ?? ""] ?? new Room();

    const [hover, setHover] = useState<Place | null>(null);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const places = roomToDisplay.places;
    
    
    // ---------- GRID BOUNDS ----------
    const bounds = useMemo(() => {
        if (Object.entries(places).length === 0) {
            return {
                minX: -margin,
                maxX: margin,
                minY: -margin,
                maxY:  margin,
            };
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        Object.values(places).forEach(r => {
            minX = Math.min(minX, r.x);
            minY = Math.min(minY, r.y);
            maxX = Math.max(maxX, r.x + r.width);
            maxY = Math.max(maxY, r.y + r.height);
        });

        return {
            minX: minX - margin,
            minY: minY - margin,
            maxX: maxX + margin,
            maxY: maxY + margin,
        };
    }, [places, margin]);//ELI:kikfrfriru

    

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

  // ---------- COLLISION ----------

  function collision(place: Place) {
    return Object.entries(places).find(([_id,r]) =>
      place.x < r.x + r.width &&
      place.x + place.width > r.x &&
      place.y < r.y + r.height &&
      place.y + place.height > r.y
    ) ?? null;
  }
  

  // ---------- MOUSE HANDLING ----------
  function svgToGrid(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const gx = Math.floor(px / CELL) + bounds.minX;
    const gy = Math.floor(py / CELL) + bounds.minY;

    return { x: gx, y: gy };
  }

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const { x, y } = svgToGrid(e);

    let h = { x, y, height: 2, width: 5, form: EPlaceForm.RECT }
    if (!collision(h)){
        setHover(h)
        setSelectedId(null);
        return;
    }
    setHover(null);

    const hoveredOverPlace = collision({form: EPlaceForm.RECT, x, y, width: 1, height: 1});
    setSelectedId(hoveredOverPlace ? hoveredOverPlace[0] : null);


  }

  function handleClick() {
    if (!hover) return;
    addPlace(hover);
    
  }

  function handleRightClick(event: { preventDefault: () => void; }){
    event.preventDefault();
    if(!selectedId)
        return;
    deletePlace(selectedId);

    return true;
  }

  function addPlace(place: Place){
    if(!account) return;

    const newId = md5(`${roomId}.${place.x}.${place.y}`);

    const updatedAccount: Account = {
        ...account,
        rooms: {
            ...account.rooms,
            [roomId]:{
                ...account.rooms[roomId],
                places:{
                    ...account.rooms[roomId].places,
                    [newId]:{...place}
                }
            }
        }
    };
    SetAccount(updatedAccount);
  }

  function deletePlace(id:string){
    if(!account) return;

    const newPlaces = account.rooms[roomId].places;
    delete newPlaces[id];

    const updatedAccount: Account = {
        ...account,
        rooms: {
            ...account.rooms,
            [roomId]:{
                ...account.rooms[roomId],
                places: newPlaces
            }
        }
    };
    SetAccount(updatedAccount);
  }

  // ---------- GRID LINES ----------
  const gridLines = [];
  for (let x = 0; x <= width; x++) {
    gridLines.push(
      <line
        key={`vx${x}`}
        x1={x * CELL}
        y1={0}
        x2={x * CELL}
        y2={height * CELL}
        stroke="#ccc"
      />
    );
  }

  for (let y = 0; y <= height; y++) {
    gridLines.push(
      <line
        key={`hy${y}`}
        x1={0}
        y1={y * CELL}
        x2={width * CELL}
        y2={y * CELL}
        stroke="#ccc"
      />
    );
  }

  // ---------- RENDER ----------
  return (
    <svg
      width={width * CELL}
      height={height * CELL}
      onMouseMove={handleMove}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      style={{ border: "1px solid black" }}
    >
      {gridLines}

      {/* placed rectangles */}
      {Object.entries(places).map(([id,place]) => (
        <rect
          key={id}
          x={(place.x - bounds.minX) * CELL}
          y={(place.y - bounds.minY) * CELL}
          width={place.width * CELL}
          height={place.height * CELL}
          fill="steelblue"
          stroke="black"
        />
      ))}

      {/* hover mock */}
      {hover && (
        <rect
          x={(hover.x - bounds.minX) * CELL}
          y={(hover.y - bounds.minY) * CELL}
          width={hover.width * CELL}
          height={hover.height * CELL}
          fill="lime"
          opacity={0.5}
        />
      )}
    </svg>
  );
}
